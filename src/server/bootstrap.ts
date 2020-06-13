import { readFileSync, existsSync } from 'fs';
import { Config } from './Config';
import { ConfigurationError, DependenciesMissingError } from './support/errors';
import { App } from './App';
import { mergeObjDeep } from '../utils';
import { Dependencies, ModuleProvider } from './support/ModuleProvider';

interface Pkg {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

let cachedApp: App;
let hasBooted = false;
let booting: Promise<void[]>;

export async function bootstrap(
  modules: ModuleProvider<any>[],
  config?: Config,
  fresh = false,
): Promise<App> {
  if (hasBooted && !fresh) { return cachedApp; }

  if (booting && !fresh) {
    await booting;
    return cachedApp;
  }

  const app = new App(config ?? {});

  // 1. Initialize each module config with defaults.
  modules.forEach((Module) => {
    app.setConfig(
      Module.module,
      mergeObjDeep(Module.defaults?.(app) ?? {}, app.getConfig(Module.module) ?? {}),
    );
  });

  // 2. Validate each module config.
  modules.forEach((Module) => {
    const invalidConfiguration = Module.configValidation?.(app);

    if (invalidConfiguration) {
      const invalidPath = `config.${Module.module}`
        + `${invalidConfiguration.path ? `.${invalidConfiguration.path}` : ''}`;

      throw new ConfigurationError(
        invalidConfiguration.code,
        invalidConfiguration.message,
        invalidPath,
        Module.module,
        invalidConfiguration.link,
      );
    }
  });

  // 3. Ensure all module dependencies have been installed.
  const pkgPath = `${process.cwd()}/package.json`;
  const pkg: Pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath).toString('utf-8')) : {};
  const isHomePkg = pkg.name === '@mihar-22/serverless-auth';

  modules.forEach((Module) => {
    const missingDeps: Dependencies[] = [];
    const dependencies = Module.dependencies?.(app);
    dependencies?.forEach((dependency) => {
      const hasDep = Object.prototype.hasOwnProperty.call(pkg.dependencies ?? {}, dependency);
      const hasDevDep = (
        isHomePkg && Object.prototype.hasOwnProperty.call(pkg.devDependencies ?? {}, dependency)
      );
      if (!hasDep && !hasDevDep) { missingDeps.push(dependency as any); }
    });
    if (missingDeps.length > 0) {
      throw new DependenciesMissingError(missingDeps, Module.module, isHomePkg);
    }
  });

  // 4. Register all module bindings.
  modules.forEach((Module) => { Module.register(app); });

  // 5. If testing environment, register all test bindings.
  if (app.isTestingEnv) {
    modules.forEach((Module) => { Module.registerTestingEnv?.(app); });
  }

  // 6. Boot all modules.
  booting = Promise.all(modules.map((Module) => Module.boot?.(app)));

  await booting;
  hasBooted = true;
  cachedApp = app;

  return app;
}

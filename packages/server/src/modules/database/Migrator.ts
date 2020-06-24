// pass in migrations: Migration[]
// up -> loop through running up
// down -> loop through down
// refresh -> loop through down first from the last to first / run up in reverse

// Do this check once per instance.
// some kind of migrations table?? -> query latest matches latest otherwise run up to it.

// only run some migrations depending on configuration (Eg: Sessions table).

// get database

// if no custom driver fetch migrations for current driver.

// perform action.

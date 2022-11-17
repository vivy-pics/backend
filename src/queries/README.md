Despite using the query builder, we have to write some queries manually as the builder doesn't support the full syntax
and other goodies that EdgeQL can provide. These queries get turned into type-safe functions that are imported later,
so make sure you run the code generator first (`yarn generate`)!

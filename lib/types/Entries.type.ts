type Entries<Obj extends Record<PropertyKey, unknown>> = {
	[K in keyof Obj]: [K, Obj[K]];
}[keyof Obj][];

export default Entries;

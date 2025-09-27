import path from 'node:path';
import type { PrismaConfig } from 'prisma';

import './src/lib/envConfig';

export default {
	schema: path.join('prisma', 'schema'),
	migrations: {
		path: path.join('prisma', 'migrations'),
	},
	views: {
		path: path.join('prisma', 'views'),
	},
	typedSql: {
		path: path.join('prisma', 'queries'),
	},
} satisfies PrismaConfig;

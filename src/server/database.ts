/**
 * This file is used to create a new instance of the PrismaClient and export it.
 * This is done to ensure that there is only one instance of the PrismaClient in the server.
 */

import { PrismaClient } from "@prisma/client";
export default new PrismaClient();

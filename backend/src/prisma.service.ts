import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super(); // Esto llama al constructor de PrismaClient
    }

    async onModuleInit() {
        await this.$connect();
    }
}
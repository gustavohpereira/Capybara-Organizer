
import { Repository } from "typeorm/repository/Repository"
import { Client } from 'entity/Client';

export class ClientService {
    public constructor(
        private readonly clientRepository: Repository<Client>
    ){}

    async getAllClients(): Promise<Client[]> {
        return this.clientRepository.find({ relations: ['tasks'] });
    }

    async getClientById(id: number): Promise<Client | null> {
        return this.clientRepository.findOne({ relations: ['tasks'], where: { id:id } });
    }

    async createClient(clientData: Partial<Client>): Promise<Client> {
        const client = this.clientRepository.create(clientData);
        return this.clientRepository.save(client);
    }

    async updateClient(id: number, clientData: Partial<Client>): Promise<Client | null> {
        await this.clientRepository.update(id, clientData);
        return this.clientRepository.findOne({ where: { id:id } });
    }

    async deleteClient(id: number): Promise<void> {
        await this.clientRepository.delete(id);
    }
}
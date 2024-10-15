import { ClientService } from '../../src/service/client.service';
import { Client } from '../../src/entity/Client';
import appDataSource from '../../src/data-source';
import { ClientController } from '../../src/controller/client.controller';
import { Repository } from 'typeorm';

jest.mock('typeorm/repository/Repository'); // Mock do TypeORM Repository

describe('ClientService', () => {
  let clientService: ClientService;
  let clientRepository: jest.Mocked<Repository<Client>>;

  beforeEach(() => {
    clientRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Client>>;

    clientService = new ClientService(clientRepository);
    const clientController = new ClientController(clientService);
  });

  describe('getAllClients', () => {
    it('should return an array of clients', async () => {
      const clients: Client[] = [{ id: 1, name: 'Client 1', tasks: [],email:"email",phone:"phone" } as Client];
      clientRepository.find.mockResolvedValue(clients);

      const result = await clientService.getAllClients();

      expect(clientRepository.find).toHaveBeenCalledWith({ relations: ['tasks'] });
      console.log(result)
      expect(result).toEqual(clients);
    });
  });

  describe('getClientById', () => {
    it('deve retornar o cliente pelo ID', async () => {
      const mockClient ={ id: 1, name: 'Client 1', tasks: [],email:"email",phone:"phone" } as Client;
      clientRepository.findOne.mockResolvedValue(mockClient);

      const result = await clientService.getClientById(1);
      expect(result).toEqual(mockClient);
      expect(clientRepository.findOne).toHaveBeenCalledWith({ relations: ['tasks'], where: { id: 1 } });
    });

    it('deve retornar null se o cliente não for encontrado', async () => {
      clientRepository.findOne.mockResolvedValue(null);

      const result = await clientService.getClientById(999);
      expect(result).toBeNull();
      expect(clientRepository.findOne).toHaveBeenCalledWith({ relations: ['tasks'], where: { id: 999 } });
    });
  });

  describe('createClient', () => {
    it('deve criar e retornar um cliente', async () => {
      const mockClientData = { name: 'Novo Cliente' };
      const mockClient = { id: 1, name: 'Client 1', tasks: [],email:"email",phone:"phone" } as Client;

      clientRepository.create.mockReturnValue(mockClient);
      clientRepository.save.mockResolvedValue(mockClient);

      const result = await clientService.createClient(mockClientData);
      expect(result).toEqual(mockClient);
      expect(clientRepository.create).toHaveBeenCalledWith(mockClientData);
      expect(clientRepository.save).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('updateClient', () => {
    it('deve atualizar e retornar o cliente', async () => {
      const mockClient ={ id: 1, name: 'Client 1', tasks: [],email:"email",phone:"phone" } as Client;
      clientRepository.findOne.mockResolvedValue(mockClient);

      const result = await clientService.updateClient(1, { name: 'Cliente Atualizado' });
      expect(result).toEqual(mockClient);
      expect(clientRepository.update).toHaveBeenCalledWith(1, { name: 'Cliente Atualizado' });
      expect(clientRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve retornar null se o cliente não for encontrado para atualização', async () => {
      clientRepository.findOne.mockResolvedValue(null);

      const result = await clientService.updateClient(999, { name: 'Cliente Inexistente' });
      expect(result).toBeNull();
    });
  });

  describe('deleteClient', () => {
    it('deve deletar o cliente pelo ID', async () => {
      clientRepository.delete.mockResolvedValue(undefined);

      await clientService.deleteClient(1);
      expect(clientRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});

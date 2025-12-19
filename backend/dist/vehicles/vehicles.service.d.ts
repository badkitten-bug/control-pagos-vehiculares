import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './vehicle.entity';
import { VehicleMileage } from './vehicle-mileage.entity';
import { CreateVehicleDto, UpdateVehicleDto, UpdateMileageDto, SearchVehiclesDto } from './dto/vehicle.dto';
import { User } from '../users/user.entity';
export declare class VehiclesService {
    private vehicleRepository;
    private mileageRepository;
    constructor(vehicleRepository: Repository<Vehicle>, mileageRepository: Repository<VehicleMileage>);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(dto: SearchVehiclesDto): Promise<{
        items: Vehicle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByPlaca(placa: string): Promise<Vehicle>;
    findById(id: number): Promise<Vehicle>;
    update(id: number, dto: UpdateVehicleDto): Promise<Vehicle>;
    updateMileage(id: number, dto: UpdateMileageDto, user: User): Promise<Vehicle>;
    getMileageHistory(id: number): Promise<VehicleMileage[]>;
    findAvailable(): Promise<Vehicle[]>;
    isAvailable(id: number): Promise<boolean>;
    updateStatus(id: number, status: VehicleStatus): Promise<Vehicle>;
}

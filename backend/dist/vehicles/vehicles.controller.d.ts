import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, UpdateMileageDto, SearchVehiclesDto } from './dto/vehicle.dto';
import { User } from '../users/user.entity';
export declare class VehiclesController {
    private vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): Promise<import("./vehicle.entity").Vehicle>;
    findAll(dto: SearchVehiclesDto): Promise<{
        items: import("./vehicle.entity").Vehicle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAvailable(): Promise<import("./vehicle.entity").Vehicle[]>;
    findByPlaca(placa: string): Promise<import("./vehicle.entity").Vehicle>;
    findById(id: number): Promise<import("./vehicle.entity").Vehicle>;
    update(id: number, dto: UpdateVehicleDto): Promise<import("./vehicle.entity").Vehicle>;
    updateMileage(id: number, dto: UpdateMileageDto, user: User): Promise<import("./vehicle.entity").Vehicle>;
    getMileageHistory(id: number): Promise<import("./vehicle-mileage.entity").VehicleMileage[]>;
}

import { Hospital } from "../models/hospital.model";


export interface CargarHospitales {
    total: number;
    hospitales: Hospital[];
}
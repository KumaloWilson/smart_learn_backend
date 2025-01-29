import { Request, Response } from 'express';
import { DepartmentService } from '../services/department_service';

export class DepartmentController {
    static async getAllDepartments(req: Request, res: Response): Promise<void> {
        try {
            const departments = await DepartmentService.getAllDepartments();
            res.json({
                success: true,
                message: 'All departments have retrieved been successfully',
                data: departments,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getDepartmentById(req: Request, res: Response): Promise<void> {
        try {
            const { department_id } = req.params;
            const department = await DepartmentService.getDepartmentById(department_id);
            if (department) {
                res.json(
                    {
                        success: true,
                        message: 'Department has retrieved been successfully',
                        data: department,
                    }
                );
            } else {
                res.status(404).json({success: false, message: 'Department not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async getDepartmentsBySchoolId(req: Request, res: Response): Promise<void> {
        try {
            const { school_id } = req.params;
            console.log('School ID:', school_id);
            const departments = await DepartmentService.getDepartmentsBySchoolId(school_id);
            if (departments.length === 0) {
                res.status(404).json({success: false, message: 'no departments found for the given school ID.' });
            }
            res.json(  {
                success: true,
                message: 'Departments have retrieved been successfully',
                data: departments,
            });

        } catch (err) {
            console.error(err); // Log any error
            res.status(500).json({ error: err });
        }
    }

    static async createDepartment(req: Request, res: Response): Promise<void> {
        try {
            const department = req.body;
            await DepartmentService.createDepartment(department);
            res.status(201).json({success: true, message: 'Department created successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async updateDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { department_id } = req.params;
            const department = req.body;
            await DepartmentService.updateDepartment(department_id, department);
            res.json({success: true, message: 'Department updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    static async deleteDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { department_id } = req.params;
            await DepartmentService.deleteDepartment(department_id);
            res.json({success: true, message: 'Department deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}

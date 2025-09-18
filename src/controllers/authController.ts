import { studentValidation, teacherValidation } from "../validations/authValidation";



export const registration = async (req: Request, res: Response) => {
    try {

        const payload = req.body;
        if (payload.role == 'teacher') {
            const { error, value } = teacherValidation.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });
        }
        const { error, value } = studentValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });


        const addTeacher = await 
    } catch (error) {

    }
}
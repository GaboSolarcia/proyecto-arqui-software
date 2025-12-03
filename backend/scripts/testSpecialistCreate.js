const { connectDB, executeQuery } = require('../config/database');

const testCreate = async () => {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await connectDB();
        
        console.log('📝 Intentando crear especialista...');
        
        const query = `
            INSERT INTO Specialists (EmployeeName, Cedula, AdmissionDate, ShiftId, IsActive)
            VALUES (@employeeName, @cedula, @admissionDate, @shiftId, @isActive);
            
            SELECT s.SpecialistId, s.EmployeeName, s.Cedula, s.AdmissionDate, s.ShiftId,
                   ws.ShiftName AS ShiftScheduleName, s.IsActive
            FROM Specialists s
            LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
            WHERE s.SpecialistId = SCOPE_IDENTITY();
        `;
        
        const params = {
            employeeName: 'Test Employee',
            cedula: '1-9999-9999',
            admissionDate: new Date(),
            shiftId: 1,
            isActive: true
        };

        console.log('Parámetros:', JSON.stringify(params, null, 2));
        
        const result = await executeQuery(query, params);
        
        console.log('✅ Especialista creado:');
        console.log(JSON.stringify(result.recordset[0], null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

testCreate();

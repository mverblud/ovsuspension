import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema({
    rol:{
        type: String,
        required:[true,'El rol es obligatorio']
    }
});

const Role = mongoose.model('Role', RoleSchema);
export default Role;
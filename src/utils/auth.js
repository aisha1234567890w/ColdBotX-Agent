export const isManager = (userEmail) => {
    if (!userEmail) return false;
    
    const managers = [
        'aishasadiqa441@gmail.com', 
        'ijazwajeeha6@gmail.com',
        'naveedk09@gmail.com',
        'admin@aifur.com', 
        'manager@aifur.com',
        'aishaaltaf@gmail.com',
        'pmls@gmail.com'
    ];
    
    const email = userEmail.toLowerCase();
    
    return managers.includes(email) || 
           email.endsWith('@aifur.com') ||
           email.includes('admin') ||
           email.includes('manager') ||
           email.includes('ops') ||
           email.includes('agent');
};

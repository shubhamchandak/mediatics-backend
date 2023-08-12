export function isNullOrEmpty(val: any): boolean {
    if(val) return false;
    return true;
}

export function validateEmail(email: string): boolean {
    // refer https://github.com/manishsaraan/email-validator
    if (!email) return false;

    const emailParts = email.split('@');

    if (emailParts.length !== 2) return false;

    const account = emailParts[0];
    const address = emailParts[1];

    if (account.length > 64) return false;

    else if (address.length > 255) return false;

    var domainParts = address.split('.');
    
    if (domainParts.some(function (part) {
        return part.length > 63;
    })) return false;

    const emailRegex: RegExp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    return emailRegex.test(email);
}
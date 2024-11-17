export const useSpecialLinks = () => {

    const toMailtoLink = (email: string): string => {
        return `mailto:${email}`;
    }

    const toPhoneLink = (phoneNumber: string): string => {
        return `tel:${phoneNumber}`;
    }

    const toWhatsAppLink = (phoneNumber: string): string => {
        return `https://wa.me/${phoneNumber}`;
    }

    return {
        toMailtoLink,
        toPhoneLink,
        toWhatsAppLink
    }
}
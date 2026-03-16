import { getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export const toBase64 = (file: File) : Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
})

export const getPhoneNumber = (country: CountryCode, number: string) => parsePhoneNumberFromString(`+${getCountryCallingCode(country)}${number}`, country)?.formatInternational()
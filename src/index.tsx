import {
    ErrorInputInvalid,
    ErrorInputRequired,
    ErrorInputNotEqual,
    ErrorInputValueTooHigh,
    ErrorInputValueTooLow,
    ErrorInputLength,
} from "fenextjs-error/cjs/Input";
import { ErrorFenextjs, ErrorFenextjsProps } from "fenextjs-error/cjs/Fenextjs";
import { ErrorCode } from "fenextjs-interface";

export interface FenextjsValidatorClassIsWhenProps {
    key: string;
    is: FenextjsValidatorClass;
    then: FenextjsValidatorClass;
    otherwise?: FenextjsValidatorClass;
    dataIsCurrent?: boolean;
}

/**
 * Interfaz que define las propiedades del constructor de la clase FenextjsValidatorClass.
 */
export interface FenextjsValidatorClassConstructorProps {
    /**
     * Nombre asociado a la instancia de FenextjsValidatorClass.
     * @type {string | undefined}
     */
    name?: string;
}
/**
 * Clase que proporciona validación de datos en TypeScript/JavaScript.
 * @template T - Tipo de los datos a validar.
 */
export class FenextjsValidatorClass<T = any> {
    /** Propiedad privada que almacena name del validador. */
    private name?: string;
    /** Propiedad privada que almacena la clase superior. */
    private parent?: FenextjsValidatorClass;
    /** Propiedad privada que almacena los datos a validar. */
    private data: T | undefined;

    // Propiedades privadas para definir diferentes reglas de validación.
    // Cada propiedad es un tipo de validación específico.

    /** Bandera que indica si se debe aplicar la validación "isEqual". */
    private equal = false;
    /** Valor con el que se compararán los datos en la validación "isEqual". */
    private equalValue: T[] | undefined = undefined;

    /** Bandera que indica si se debe aplicar la validación "isRequired". */
    private required = false;
    /** Bandera que indica si los datos deben ser un booleano en la validación "isBoolean". */
    private boolean = false;
    /** Bandera que indica si los datos deben ser un número en la validación "isNumber". */
    private number = false;
    /** Bandera que indica si los datos deben ser un email en la validación "onEmail". */
    private email = false;
    /** Bandera que indica si los datos deben ser una cadena en la validación "isString". */
    private string = false;
    /** Bandera que indica si los datos deben ser una cadena en la validación "isLength". */
    private length = false;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isLength". */
    private lengthValue: number | undefined = undefined;
    /** Bandera que indica si los datos deben ser una cadena en la validación "isCompareRef". */
    private compareRef = false;
    /** Valor que contiene key para cada propiedad del objeto en la validación "isCompareRef". */
    private compareRefKey: any = undefined;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isCompareRef". */
    private compareRefValue: any = undefined;

    /** Bandera que indica si los datos deben ser una fecha en la validación "isDate". */
    private date = false;
    /** Bandera que indica si los datos deben ser un objeto en la validación "isObject". */
    private object = false;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isObject". */
    private objectValue:
        | { [id in keyof T]?: FenextjsValidatorClass }
        | undefined = undefined;

    /** Bandera que indica si los datos deben ser una cadena en la validación "isWhen". */
    private when = false;
    /** Value que contiene la validacion de "isWhen" */
    private whenValue: FenextjsValidatorClassIsWhenProps[] | undefined =
        undefined;

    /** Bandera que indica si los datos deben ser un array en la validación "isArray". */
    private array = false;
    /** Valor que contiene las reglas de validación para cada elemento del array en la validación "isArray". */
    private arrayValue: FenextjsValidatorClass | undefined = undefined;

    /** Bandera que indica si los datos deben ser mayor que un valor específico en la validación "isMin". */
    private min = false;
    /** Bandera que indica si los datos deben ser mayor o igual que un valor específico en la validación "isMinOrEqual". */
    private minOrEqual = false;
    /** Valor con el que se compararán los datos en las validaciones "isMin" y "isMinOrEqual". */
    private minValue: number | Date | undefined = undefined;

    /** Bandera que indica si los datos deben ser menor que un valor específico en la validación "isMax". */
    private max = false;
    /** Bandera que indica si los datos deben ser menor o igual que un valor específico en la validación "isMaxOrEqual". */
    private maxOrEqual = false;
    /** Valor con el que se compararán los datos en las validaciones "isMax" y "isMaxOrEqual". */
    private maxValue: number | Date | undefined = undefined;

    /** Bandera que indica si los datos deben ser una cadena que cumpla la regla regex. */
    private regex = false;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isRegex". */
    private regexValue: RegExp | undefined = undefined;
    /** Bandera que indica si los datos deben ser una cadena que cumpla la regla regex. */
    private custom = false;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isRegex". */
    private customValue:
        | ((data: T, parent?: FenextjsValidatorClass) => true | ErrorFenextjs)
        | undefined = undefined;

    /** Bandera que indica si los datos deben ser una cadena en la validación "isWhen". */
    private or = false;
    /** Value que contiene la validacion de "isWhen" */
    private orValue: FenextjsValidatorClass[] | undefined = undefined;

    private enum = false;
    /** Valor que contiene las reglas de validación para cada propiedad del objeto en la validación "isEnum". */
    private enumValue: object | undefined = undefined;

    /** Mensaje personalizado para error */
    private messageError: {
        [id in
            | "isEqual"
            | "isRequered"
            | "isBoolean"
            | "isNumber"
            | "isString"
            | "isLength"
            | "isDate"
            | "isObject"
            | "isArray"
            | "isMin"
            | "isMinOrEqual"
            | "isMax"
            | "isMaxOrEqual"
            | "isCompareRef"
            | "isRegex"
            | "isEmail"
            | "isCustom"
            | "isOr"
            | "isEnum"]?: string | undefined;
    } = {};

    /**
     * Constructor de la clase FenextjsValidatorClass.
     * @param {FenextjsValidatorClassConstructorProps} props - Opcional. Propiedades que se pueden pasar al constructor.
     *                                                       Un objeto que contiene las propiedades del constructor.
     *                                                       Por ejemplo, puede contener la propiedad "name".
     * @returns {void}
     */
    constructor(props?: FenextjsValidatorClassConstructorProps) {
        /**
         * Nombre asociado a la instancia de FenextjsValidatorClass.
         * @type {string | undefined}
         */
        this.name = props?.name;
    }

    /**
     * Método para establecer el nombre asociado a la instancia de FenextjsValidatorClass.
     * @param {string} name - El nombre a establecer para la instancia actual de FenextjsValidatorClass.
     * @returns {FenextjsValidatorClass} - La instancia actual de la clase FenextjsValidatorClass, lo que permite el encadenamiento de métodos.
     */
    setName(name: string) {
        /**
         * Nombre asociado a la instancia de FenextjsValidatorClass.
         * @type {string}
         */
        this.name = name;
        return this;
    }

    /**
     * Método privado para obtener el nombre completo de la instancia actual de FenextjsValidatorClass.
     * Si esta instancia tiene un padre, obtiene el nombre completo que incluye el nombre de su padre.
     * Si no tiene un padre, devuelve solo el nombre asociado a esta instancia.
     *
     * @returns {string} - El nombre completo de la instancia actual de FenextjsValidatorClass.
     */
    getName() {
        if (this.parent) {
            return this.parent.getName() + "." + this.name;
        }
        return this.name;
    }
    /**
     * Método public para obtener el valor de data.
     * @returns {T | undefined}
     * @public
     */
    getData() {
        return this.data;
    }

    /**
     * Método para establecer el padre de la instancia actual de FenextjsValidatorClass.
     * El padre es otra instancia de FenextjsValidatorClass que se utiliza como contexto superior.
     *
     * @param {FenextjsValidatorClass} parent - La instancia de FenextjsValidatorClass que se establecerá como padre.
     * @returns {FenextjsValidatorClass} - La instancia actual de la clase FenextjsValidatorClass, lo que permite el encadenamiento de métodos.
     */
    setParent(parent: FenextjsValidatorClass) {
        /**
         * El padre de la instancia actual de FenextjsValidatorClass.
         * @type {FenextjsValidatorClass}
         */
        this.parent = parent;
        return this;
    }

    /**
     * Método para definir la validación "isEqual".
     * Establece la regla de que los datos deben ser iguales al valor especificado.
     * @param d - Valor a comparar con los datos.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isEqual(d: T[] | T, msg?: string) {
        this.equal = true;
        this.equalValue = [d].flat(2) as T[];
        this.messageError.isEqual = msg ?? undefined;
        return this;
    }
    /**
     * Método privado que valida la regla "isEqual".
     * Verifica si los datos son iguales al valor especificado en la regla de validación "isEqual".
     * @throws {ErrorInputInvalid} Si los datos no son iguales al valor especificado.
     * @returns Instancia de FenextjsValidatorClass.
     * @private
     */
    onEqual() {
        // Si la validación "isEqual" no está habilitada, no se hace nada.
        if (!this.equal || !this.equalValue || this.equalValue.length == 0) {
            return;
        }

        // Compara el valor almacenado en equalValue con los datos a validar (data).
        // Si no son iguales, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (!this.equalValue.includes(this.data as T)) {
            this.onError(ErrorCode.INPUT_NOT_EQUAL, this.messageError?.isEqual);
        }

        return this;
    }

    /**
     * Método para habilitar la validación "isRequired".
     * Establece la regla de que los datos deben estar presentes y no ser nulos o indefinidos.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isRequired(msg?: string) {
        this.required = true;
        this.messageError.isRequered = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isRequired".
     * Verifica si los datos cumplen con la regla de ser requeridos (estar presentes y no ser nulos o indefinidos).
     * @throws {ErrorInputRequired} Si los datos son nulos, indefinidos o una cadena vacía.
     * @private
     */
    onRequired() {
        // Si la validación "isRequired" no está habilitada, no se hace nada.
        if (!this.required) {
            return;
        }
        // Comprueba si los datos son nulos, indefinidos o una cadena vacía.
        // Si se cumple alguna de estas condiciones, lanza un ErrorInputRequired para indicar que la validación falló.
        if (this.data === null || this.data == undefined || this.data === "") {
            this.onError(
                ErrorCode.INPUT_REQUIRED,
                this.messageError?.isRequered,
            );
        }
    }
    /**
     * Método para habilitar la validación "isBoolean".
     * Establece la regla de que los datos deben ser de tipo booleano.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isBoolean(msg?: string) {
        this.boolean = true;
        this.messageError.isBoolean = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isBoolean".
     * Verifica si los datos cumplen con la regla de ser de tipo booleano.
     * @throws {ErrorInputInvalid} Si los datos no son de tipo booleano.
     * @private
     */
    onBoolean() {
        // Si la validación "isBoolean" no está habilitada, no se hace nada.
        if (!this.boolean) {
            return;
        }
        // Comprueba si los datos no son de tipo booleano.
        // Si no son de tipo booleano, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (typeof this.data !== "boolean") {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isBoolean);
        }
    }
    /**
     * Método para habilitar la validación "isNumber".
     * Establece la regla de que los datos deben ser de tipo número.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isNumber(msg?: string) {
        this.number = true;
        this.messageError.isNumber = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isNumber".
     * Verifica si los datos cumplen con la regla de ser de tipo número.
     * @throws {ErrorInputInvalid} Si los datos no son de tipo número.
     * @private
     */
    onNumber() {
        // Si la validación "isNumber" no está habilitada, no se hace nada.
        if (!this.number) {
            return;
        }
        // Comprueba si los datos no son de tipo número.
        // Si no son de tipo número, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (typeof this.data !== "number") {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isNumber);
        }
    }
    /**
     * Método para habilitar la validación "isString".
     * Establece la regla de que los datos deben ser de tipo cadena (string).
     * @returns Instancia de FenextjsValidatorClass.
     */
    isString(msg?: string) {
        this.string = true;
        this.messageError.isString = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isString".
     * Verifica si los datos cumplen con la regla de ser de tipo cadena (string).
     * @throws {ErrorInputInvalid} Si los datos no son de tipo cadena (string).
     * @private
     */
    onString() {
        // Si la validación "isString" no está habilitada, no se hace nada.
        if (!this.string) {
            return;
        }
        // Comprueba si los datos no son de tipo cadena (string).
        // Si no son de tipo cadena (string), lanza un ErrorInputInvalid para indicar que la validación falló.
        if (typeof this.data !== "string") {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isString);
        }
    }
    /**
     * Método para habilitar la validación de longitud.
     * Establece la regla de que los datos deben tener una longitud específica.
     *
     * @param {number} length - La longitud que deben tener los datos para que la validación sea válida.
     * @returns {FenextjsValidatorClass} - La instancia actual de la clase FenextjsValidatorClass, lo que permite el encadenamiento de métodos.
     */
    isLength(length: number, msg?: string) {
        this.length = true;
        this.lengthValue = length;
        this.messageError.isLength = msg;
        return this;
    }
    /**
     * Método privado para validar la longitud de los datos.
     * Si se habilitó la validación de longitud con "isLength()", verifica que los datos cumplan con la longitud requerida.
     * Si no se cumple, lanza una excepción "ErrorInputInvalid" con el código "ErrorCode.INPUT_INVALID".
     *
     * @returns {void}
     * @throws {ErrorInputInvalid} - Si los datos no cumplen con la longitud requerida.
     */
    onLength() {
        if (!this.length || !this.lengthValue) {
            return;
        }

        if (Array.isArray(this.data) || typeof this.data == "string") {
            if (this.data?.length !== this.lengthValue) {
                // Lanza una excepción "ErrorInputInvalid" con el código "ErrorCode.INPUT_INVALID".
                this.onError(
                    ErrorCode.INPUT_LENGTH,
                    this.messageError?.isLength,
                );
            }
        }
    }
    /**
     * Método para habilitar la validación "isDate".
     * Establece la regla de que los datos deben ser de tipo Date (fecha).
     * @returns Instancia de FenextjsValidatorClass.
     */
    isDate(msg?: string) {
        this.date = true;
        this.messageError.isDate = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isDate".
     * Verifica si los datos cumplen con la regla de ser de tipo Date (fecha).
     * @throws {ErrorInputInvalid} Si los datos no son de tipo Date (fecha).
     * @private
     */
    onDate() {
        // Si la validación "isDate" no está habilitada, no se hace nada.
        if (!this.date) {
            return;
        }
        // Comprueba si los datos no son de tipo Date (fecha).
        // Si no son de tipo Date (fecha), lanza un ErrorInputInvalid para indicar que la validación falló.
        if (!(this.data instanceof Date)) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isDate);
        }
    }
    /**
     * Método para habilitar la validación "isObject".
     * Establece la regla de que los datos deben ser de tipo objeto.
     * @param obj - Objeto con las reglas de validación para cada propiedad del objeto.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isObject(
        obj: { [id in keyof T]?: FenextjsValidatorClass } | undefined,
        msg?: string,
    ) {
        this.object = true;
        this.objectValue = obj;
        this.messageError.isObject = msg;
        return this;
    }
    /**
     * Método para habilitar obtener la validación "isObject".
     * @returns objectValue
     */
    getObjectValidator():
        | { [id in keyof T]?: FenextjsValidatorClass }
        | undefined {
        return this.object ? this.objectValue : undefined;
    }
    /**
     * Método privado que valida la regla "isObject".
     * Verifica si los datos cumplen con la regla de ser de tipo objeto y aplica las reglas de validación para cada propiedad del objeto.
     * @throws {ErrorInputInvalid} Si los datos no son de tipo objeto o alguna propiedad no cumple con las reglas de validación.
     * @private
     */
    onObject() {
        // Si la validación "isObject" no está habilitada , no se hace nada.
        if (!this.object) {
            return;
        }
        // Comprueba si los datos no son de tipo objeto.
        // Si no son de tipo objeto, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (typeof this.data !== "object" && this.messageError?.isObject) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isObject);
        }
        // Si la validación "isObject"  no se proporcionaron reglas de validación (objectValue), no se hace nada.
        if (!this.objectValue) {
            return;
        }

        // Obtiene las claves (propiedades) del objeto con las reglas de validación (objectValue).
        const keys = Object.keys(this.objectValue);

        // Itera sobre cada propiedad del objeto y aplica las reglas de validación correspondientes.
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const validator = this.objectValue[key];
            if (!validator.name) {
                validator.setName(key);
            }
            if (validator.compareRef) {
                validator.setCompareRef(this.data?.[validator.compareRefKey]);
            }
            validator.setParent(this);
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const validator = this.objectValue[key];
            const r = validator.onValidate(this.data?.[key]);

            // Si alguna propiedad no cumple con las reglas de validación, se lanza el error devuelto por la validación.
            if (r instanceof ErrorFenextjs) {
                this.onError(r.code, r.msg ?? r?.message);
                throw r;
            }
        }
    }
    /**
     * Método para habilitar la validación "isArray".
     * Establece la regla de que los datos deben ser un array.
     * @param item - Instancia de FenextjsValidatorClass que define las reglas de validación para cada elemento del array.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isArray(
        item: FenextjsValidatorClass | undefined = undefined,
        msg?: string,
    ) {
        this.array = true;
        this.arrayValue = item;
        this.messageError.isArray = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "isArray".
     * Verifica si los datos cumplen con la regla de ser un array y aplica las reglas de validación para cada elemento del array.
     * @throws {ErrorInputInvalid} Si los datos no son un array o alguno de los elementos no cumple con las reglas de validación.
     * @private
     */
    onArray() {
        // Si la validación "isArray" no está habilitada, no se hace nada.
        if (!this.array) {
            return;
        }
        // Comprueba si los datos no son un array.
        // Si no son un array, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (!Array.isArray(this.data)) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isArray);
            return;
        }
        // Si la validación "isArray" no se proporcionó una regla de validación para los elementos del array (arrayValue), no se hace nada.
        if (!this.arrayValue) {
            return;
        }
        // Itera sobre cada elemento del array y aplica las reglas de validación definidas en arrayValue.
        const validator = this.arrayValue;
        validator.setParent(this);
        for (let i = 0; i < this.data.length; i++) {
            const item = this.data[i];
            validator.setName(`${i}`);
            const r = validator.onValidate(item);

            // Si algún elemento no cumple con las reglas de validación, se lanza el error devuelto por la validación.
            if (r !== true) {
                throw r;
            }
        }
    }

    /**
     * Método public para obtener el valor de validacion de array.
     * @returns {FenextjsValidatorClassIsWhenProps | undefined}
     * @public
     */
    getArrayValue() {
        return this.arrayValue;
    }
    /**
     * Método para habilitar la validación "isMin".
     * Establece la regla de que los datos deben ser mayores que un valor específico.
     * @param min - Valor mínimo que los datos deben superar.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isMin(min: number | Date, msg?: string) {
        this.min = true;
        this.minValue = min;
        this.messageError.isMin = msg;
        return this;
    }
    /**
     * Método para habilitar la validación "isMinOrEqual".
     * Establece la regla de que los datos deben ser mayores o iguales que un valor específico.
     * @param min - Valor mínimo que los datos deben superar o igualar.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isMinOrEqual(min: number | Date, msg?: string) {
        this.minOrEqual = true;
        this.minValue = min;
        this.messageError.isMinOrEqual = msg;
        return this;
    }
    /**
     * Método privado que valida las reglas "isMin" y "isMinOrEqual".
     * Verifica si los datos cumplen con las reglas de ser mayores que un valor mínimo o mayores/iguales al valor mínimo.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con las reglas de validación.
     * @private
     */
    onMin() {
        // Variable para almacenar el valor numérico o longitud (si el objeto es un array o cadena) de los datos.
        let minValidate: number | undefined = undefined;

        // Determina el valor numérico o la longitud según el tipo de dato para realizar la comparación con el valor mínimo (minValue).
        if (Array.isArray(this.data)) {
            minValidate = this.data.length;
        } else if (typeof this.data === "number") {
            minValidate = this.data;
        } else if (typeof this.data === "string") {
            minValidate = this.data.length;
        } else if (this.data instanceof Date) {
            minValidate = this.data.getTime();
        }

        // Obtiene el valor mínimo (minValue) para realizar la comparación.
        let nMinValue = this.minValue;
        if (nMinValue instanceof Date) {
            nMinValue = nMinValue.getTime();
        }

        // Verifica si se habilitó la regla "isMin" y si los datos no superan el valor mínimo (minValue).
        // Si no se cumple, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (
            this.min &&
            !(
                minValidate != undefined &&
                nMinValue != undefined &&
                minValidate > nMinValue
            )
        ) {
            this.onError(
                ErrorCode.INPUT_VALUE_TOO_LOW,
                this.messageError?.isMin,
            );
        }

        // Verifica si se habilitó la regla "isMinOrEqual" y si los datos no superan o igualan el valor mínimo (minValue).
        // Si no se cumple, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (
            this.minOrEqual &&
            !(
                minValidate != undefined &&
                nMinValue != undefined &&
                minValidate >= nMinValue
            )
        ) {
            this.onError(
                ErrorCode.INPUT_VALUE_TOO_LOW,
                this.messageError?.isMinOrEqual,
            );
        }
    }
    /**
     * Método para habilitar la validación "isMax".
     * Establece la regla de que los datos deben ser menores que un valor específico.
     * @param max - Valor máximo que los datos deben ser menores que él.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isMax(max: number | Date, msg?: string) {
        this.max = true;
        this.maxValue = max;
        this.messageError.isMax = msg;
        return this;
    }
    /**
     * Método para habilitar la validación "isMaxOrEqual".
     * Establece la regla de que los datos deben ser menores o iguales que un valor específico.
     * @param max - Valor máximo que los datos deben ser menores o igual que él.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isMaxOrEqual(max: number | Date, msg?: string) {
        this.maxOrEqual = true;
        this.maxValue = max;
        this.messageError.isMaxOrEqual = msg;
        return this;
    }
    /**
     * Método privado que valida las reglas "isMax" y "isMaxOrEqual".
     * Verifica si los datos cumplen con las reglas de ser menores que un valor máximo o menores/iguales al valor máximo.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con las reglas de validación.
     * @private
     */
    onMax() {
        // Variable para almacenar el valor numérico o longitud (si el objeto es un array o cadena) de los datos.
        let maxValidate: number | undefined = undefined;

        // Determina el valor numérico o la longitud según el tipo de dato para realizar la comparación con el valor máximo (maxValue).
        if (Array.isArray(this.data)) {
            maxValidate = this.data.length;
        } else if (typeof this.data === "number") {
            maxValidate = this.data;
        } else if (typeof this.data === "string") {
            maxValidate = this.data.length;
        } else if (this.data instanceof Date) {
            maxValidate = this.data.getTime();
        }

        // Obtiene el valor máximo (maxValue) para realizar la comparación.
        let nMaxValue = this.maxValue;
        if (nMaxValue instanceof Date) {
            nMaxValue = nMaxValue.getTime();
        }

        // Verifica si se habilitó la regla "isMax" y si los datos no son menores que el valor máximo (maxValue).
        // Si no se cumple, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (
            this.max &&
            !(
                maxValidate != undefined &&
                nMaxValue != undefined &&
                maxValidate < nMaxValue
            )
        ) {
            this.onError(
                ErrorCode.INPUT_VALUE_TOO_HIGH,
                this.messageError?.isMax,
            );
        }

        // Verifica si se habilitó la regla "isMaxOrEqual" y si los datos no son menores o iguales al valor máximo (maxValue).
        // Si no se cumple, lanza un ErrorInputInvalid para indicar que la validación falló.
        if (
            this.maxOrEqual &&
            !(
                maxValidate != undefined &&
                nMaxValue != undefined &&
                maxValidate <= nMaxValue
            )
        ) {
            this.onError(
                ErrorCode.INPUT_VALUE_TOO_HIGH,
                this.messageError?.isMaxOrEqual,
            );
        }
    }
    /**
     * Método para habilitar la comparación de valores de referencia.
     * Establece la regla de que los datos deben ser iguales a otro valor de referencia almacenado en la instancia.
     *
     * @param {string} refKey - La clave que identifica el valor de referencia almacenado en la instancia para la comparación.
     * @returns {FenextjsValidatorClass} - La instancia actual de la clase FenextjsValidatorClass, lo que permite el encadenamiento de métodos.
     */
    isCompareRef(refKey: string, msg?: string) {
        this.compareRef = true;
        this.compareRefKey = refKey;
        this.messageError.isCompareRef = msg;
        return this;
    }
    /**
     * Método para obtener la comparación de valores de referencia.
     *
     * @returns {any} - compareRefKey.
     */
    getCompareRef() {
        return this.compareRef ? this.compareRefKey : undefined;
    }
    /**
     * Método privado para establecer el valor de referencia para la comparación.
     * Se utiliza junto con "isCompareRef()" para definir el valor de referencia que se utilizará en la comparación de datos.
     *
     * @param {any} refValue - El valor de referencia que se utilizará en la comparación de datos.
     * @returns {FenextjsValidatorClass} - La instancia actual de la clase FenextjsValidatorClass, lo que permite el encadenamiento de métodos.
     */
    setCompareRef(refValue: any) {
        this.compareRefValue = refValue;
        return this;
    }
    /**
     * Método privado para realizar la comparación de valores de referencia.
     * Si se habilitó la comparación de valores de referencia con "isCompareRef()",
     * verifica que los datos sean iguales al valor de referencia establecido con "setCompareRef()".
     * Si no se cumple, lanza una excepción "ErrorInputInvalid" con el código "ErrorCode.INPUT_INVALID".
     *
     * @returns {void}
     * @throws {ErrorInputInvalid} - Si los datos no son iguales al valor de referencia.
     */
    onCompareRef() {
        if (!this.compareRef) {
            return;
        }

        if (this.compareRefValue !== this.data) {
            // Lanza una excepción "ErrorInputInvalid" con el código "ErrorCode.INPUT_INVALID".
            this.onError(
                ErrorCode.INPUT_NOT_EQUAL,
                this.messageError?.isCompareRef,
            );
        }
    }
    /**
     * Método privado para manejar errores en la validación.
     *
     * @param {ErrorCode} code - Opcional. El código de error que indica el tipo de error ocurrido.
     * @returns {void}
     * @throws {ErrorFenextjs} - Una excepción específica basada en el código de error proporcionado o una excepción general "ErrorFenextjs".
     */
    onError(code?: ErrorCode, message?: string) {
        // Crear un objeto que mapea los códigos de error a las clases de error correspondientes.
        const props: ErrorFenextjsProps<any> = {
            input: this.getName(),
            message,
        };
        const sw: {
            [id in ErrorCode]?: ErrorFenextjs;
        } = {
            INPUT_REQUIRED: new ErrorInputRequired(props),
            INPUT_NOT_EQUAL: new ErrorInputNotEqual({
                ...props,
                equal: this.equalValue,
            }),
            INPUT_INVALID: new ErrorInputInvalid(props),
            INPUT_VALUE_TOO_HIGH: new ErrorInputValueTooHigh({
                ...props,
                max: this.maxValue,
            }),
            INPUT_VALUE_TOO_LOW: new ErrorInputValueTooLow({
                ...props,
                min: this.minValue,
            }),
            INPUT_LENGTH: new ErrorInputLength({
                ...props,
                length: this.lengthValue,
            }),
        };

        // Lanza una excepción específica basada en el código de error proporcionado o una excepción general "ErrorFenextjs".
        throw sw?.[code ?? ErrorCode.ERROR] ?? new ErrorFenextjs(props);
    }
    /**
     * Método para habilitar la validación "isWhen".
     * Establece la regla de que los comparacion cuando sea correcto la validacion.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isWhen(data: FenextjsValidatorClassIsWhenProps) {
        this.when = true;
        this.whenValue ??= [];
        this.whenValue.push(data);
        return this;
    }
    /**
     * Método privado que valida la regla "onWhen".
     * Verifica si los datos cumplen con whenIs y when Key para adicionar la la validacion whenThen.
     * @throws {ErrorInputInvalid} Si los datos no son de tipo Date (fecha).
     * @private
     */
    onWhen() {
        // Si la validación "isWhen" no está habilitada, no se hace nada.
        if (!this.when) {
            return;
        }
        // Si la validación de datos necesarios no existen, no se hace nada.
        if (!this.whenValue) {
            return;
        }
        for (let i = 0; i < this.whenValue.length; i++) {
            const validator = this.whenValue[i];
            let parent: FenextjsValidatorClass | undefined = this.parent;
            if (validator.dataIsCurrent === true) {
                parent = this;
            }
            if (!parent) {
                continue;
            }
            // Si whenIs es corrento ejecuta la validacion
            if (validator.is.onValidate(parent.data[validator.key]) === true) {
                validator.then.setParent(parent);
                validator.then.setName(this.name ?? "");
                const result = validator.then.onValidate(this.data);
                if (result !== true) {
                    throw result;
                }
            } else {
                if (validator.otherwise) {
                    validator.otherwise.setParent(parent);
                    validator.otherwise.setName(this.name ?? "");
                    const result = validator.otherwise.onValidate(this.data);
                    if (result !== true) {
                        throw result;
                    }
                }
            }
        }
    }

    /**
     * Método public para obtener el valor de validacion de when.
     * @returns {FenextjsValidatorClassIsWhenProps[] | undefined}
     * @public
     */
    getWhenValue() {
        return this.whenValue;
    }
    /**
     * Método para habilitar la validación "isRegex".
     * Establece la regla de que los comparacion cuando sea correcto la validacion.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isRegex(data: RegExp, msg?: string) {
        this.regex = true;
        this.regexValue = data;
        this.messageError.isRegex = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "onRegex".
     * Verifica si los datos cumplen con la comparacion con regexValue.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con la compracion.
     * @private
     */
    onRegex() {
        // Si la validación "isRegex" no está habilitada, no se hace nada.
        if (!this.regex) {
            return;
        }
        // Si la validación de datos necesarios no existen, no se hace nada.
        if (!this.regexValue) {
            return;
        }
        // Si la validación de datos sean string.
        if (!(typeof this.data == "string")) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isRegex);
            return;
        }

        // Si la validación de datos sean cumplan con el regex.
        if (!this.regexValue.test(this.data)) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isRegex);
            return;
        }
    }
    /**
     * Método para habilitar la validación "isEmail".
     * Establece la regla de que los comparacion cuando sea correcto la validacion.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isEmail(msg?: string) {
        this.email = true;
        this.messageError.isEmail = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "onEmail".
     * Verifica si los datos cumplen con la comparacion con email.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con la compracion.
     * @private
     */
    onEmail() {
        // Si la validación "isEmail" no está habilitada, no se hace nada.
        if (!this.email) {
            return;
        }
        // Si la validación de datos sean string.
        if (!(typeof this.data == "string")) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isEmail);
            return;
        }
        /*eslint no-useless-escape: "off"*/
        const validateEmail = /^[\w-\.]+@([\w-]+\.)+\w{1,}/g;
        // Si la validación de datos sean cumplan con el email.
        if (!validateEmail.test(this.data)) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isEmail);
            return;
        }
    }

    /**
     * Método para habilitar la validación "onCustom".
     * Establece la regla de que los comparacion cuando se cumpla una validacion custom.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isCustom(
        data: (
            data: T,
            parent?: FenextjsValidatorClass,
        ) => true | ErrorFenextjs,
        msg?: string,
    ) {
        this.custom = true;
        this.customValue = data;
        this.messageError.isCustom = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "onCustom".
     * Verifica si los datos cumplen con la comparacion custom.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con la compracion.
     * @private
     */
    onCustom() {
        // Si la validación "isCustom" no está habilitada, no se hace nada.
        if (!this.custom) {
            return;
        }
        if (typeof this.customValue !== "function") {
            return;
        }
        if (this.data == undefined) {
            return;
        }
        const v = this.customValue(this.data, this?.parent);
        if (v != true) {
            this.onError(v.code, this.messageError?.isCustom ?? v.message);
            return;
        }
    }

    /**
     * Método para definir la validación "isOr".
     * Establece la regla de que los datos deben cumplir al menos una validacion.
     * @param d - Comparador para los datos.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isOr(d: FenextjsValidatorClass[], msg?: string) {
        this.or = true;
        this.orValue = d;
        this.messageError.isOr = msg ?? undefined;
        return this;
    }
    /**
     * Método privado que valida la regla "isOr".
     * Verifica si los datos cumplen con almenos una validacion.
     * @throws {ErrorInputInvalid} Si los datos no son iguales al valor especificado.
     * @returns Instancia de FenextjsValidatorClass.
     * @private
     */
    onOr() {
        // Si la validación "isOr" no está habilitada, no se hace nada.
        if (!this.or || !this.orValue || this.orValue.length == 0) {
            return;
        }
        if (this.orValue.some((e) => e.onValidate(this.data) === true)) {
            return this;
        }
        this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isOr);

        return this;
    }

    /**
     * Método para habilitar la validación "isEnum".
     * Establece la regla de que los comparacion cuando sea correcto la validacion.
     * @returns Instancia de FenextjsValidatorClass.
     */
    isEnum(data: object, msg?: string) {
        this.enum = true;
        this.enumValue = data;
        this.messageError.isEnum = msg;
        return this;
    }
    /**
     * Método privado que valida la regla "onEnum".
     * Verifica si los datos cumplen con la comparacion con enumValue.
     * @throws {ErrorInputInvalid} Si los datos no cumplen con la compracion.
     * @private
     */
    onEnum() {
        // Si la validación "isEnum" no está habilitada, no se hace nada.
        if (!this.enum) {
            return;
        }
        // Si la validación de datos necesarios no existen, no se hace nada.
        if (!this.enumValue) {
            return;
        }

        // Si la validación de datos sean cumplan con el regex.
        if (!Object.values(this.enumValue).includes(this.data)) {
            this.onError(ErrorCode.INPUT_INVALID, this.messageError?.isEnum);
            return;
        }
    }

    /**
     * Método para validar los datos proporcionados según las reglas establecidas.
     * Ejecuta todas las reglas de validación habilitadas previamente para los datos.
     * @param d - Datos que se deben validar.
     * @returns True si los datos cumplen con todas las reglas de validación; de lo contrario, devuelve el error que indica la regla de validación que falló.
     */
    onValidate(d: T): ErrorFenextjs | true {
        try {
            // Asigna los datos proporcionados para su validación.
            this.data = d;

            // Ejecuta todas las reglas de validación habilitadas para los datos.
            this.onWhen();
            this.onEqual();
            this.onRequired();
            this.onBoolean();
            this.onNumber();
            this.onString();
            this.onRegex();
            this.onEmail();
            this.onLength();
            this.onDate();
            this.onObject();
            this.onArray();
            this.onMin();
            this.onMax();
            this.onCompareRef();
            this.onCustom();
            this.onOr();
            this.onEnum();

            // Si todas las reglas de validación se cumplen, retorna true para indicar que los datos son válidos.
            return true;
        } catch (error) {
            // Si alguna regla de validación falla, captura el error y lo devuelve para indicar qué regla falló.
            return error as ErrorFenextjs;
        }
    }
}
/**
 * Función para crear una instancia de la clase FenextjsValidatorClass y obtener un validador.
 *
 * @param {FenextjsValidatorClassConstructorProps} props - Opcional. Propiedades que se pueden pasar al constructor de FenextjsValidatorClass.
 *                                                       Un objeto que contiene las propiedades del constructor de la clase FenextjsValidatorClass.
 *                                                       Por ejemplo, puede contener la propiedad "name".
 *
 * @returns {FenextjsValidatorClass} - Una nueva instancia de la clase FenextjsValidatorClass que se utilizará para definir reglas de validación y validar datos.
 */
export const FenextjsValidator = <T = any,>(
    props?: FenextjsValidatorClassConstructorProps,
) => new FenextjsValidatorClass<T>(props);

export const FV = FenextjsValidator;

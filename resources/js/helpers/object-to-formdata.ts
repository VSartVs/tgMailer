export const options = {
    /**
     * include array indices in FormData keys
     * включать индексы массива в ключи данных формы
     * defaults to false
     */
    indices: true,

    /**
     * treat null values like undefined values and ignore them
     * относитесь к нулевым значениям как
     * к неопределенным значениям и игнорируйте их
     * defaults to false
     */
    nullsAsUndefineds: false,

    /**
     * convert true or false to 1 or 0 respectively
     * преобразуйте значение true или false в 1 или 0 соответственно
     * defaults to false
     */
    booleansAsIntegers: true,

    /**
     * store arrays even if they're empty
     * храните массивы, даже если они пусты
     * defaults to false
     */
    allowEmptyArrays: true,

    /**
     * don't include array notation in FormData keys for any attributes except Files in arrays
     * не включайте обозначение массива в ключи
     * данных формы для любых атрибутов, кроме файлов в массивах
     * defaults to false
     */
    noAttributesWithArrayNotation: false,

    /**
     * don't include array notation in FormData keys for Files in arrays
     * не включайте обозначение массива в ключи
     * данных формы для файлов в массивах
     * defaults to false
     */
    noFilesWithArrayNotation: false,

    /**
     * use dots instead of brackets for object notation in FormData keys
     * используйте точки вместо скобок для обозначения
     * объектов в ключах данных формы
     * defaults to false
     */
    dotsForObjectNotation: true,
}

function isUndefined(value) {
    return value === undefined
}

function isNull(value) {
    return value === null
}

function isBoolean(value) {
    return typeof value === 'boolean'
}

function isObject(value) {
    return value === Object(value)
}

function isArray(value) {
    return Array.isArray(value)
}

function isDate(value) {
    return value instanceof Date
}

function isBlob(value, isReactNative) {
    return isReactNative
        ? isObject(value) && !isUndefined(value.uri)
        : isObject(value) &&
        typeof value.size === 'number' &&
        typeof value.type === 'string' &&
        typeof value.slice === 'function'
}

function isFile(value, isReactNative) {
    return (
        isBlob(value, isReactNative) &&
        typeof value.name === 'string' &&
        (isObject(value.lastModifiedDate) || typeof value.lastModified === 'number')
    )
}

function initCfg(value) {
    return isUndefined(value) ? false : value
}

export function objToFD(obj, cfg, fd?, pre?) {
    cfg = cfg || {}
    fd = fd || new FormData()

    cfg.indices = initCfg(cfg.indices)
    cfg.nullsAsUndefineds = initCfg(cfg.nullsAsUndefineds)
    cfg.booleansAsIntegers = initCfg(cfg.booleansAsIntegers)
    cfg.allowEmptyArrays = initCfg(cfg.allowEmptyArrays)
    cfg.noAttributesWithArrayNotation = initCfg(
        cfg.noAttributesWithArrayNotation,
    )
    cfg.noFilesWithArrayNotation = initCfg(cfg.noFilesWithArrayNotation)
    cfg.dotsForObjectNotation = initCfg(cfg.dotsForObjectNotation)

    const isReactNative = typeof fd.getParts === 'function'

    if (isUndefined(obj)) {
        return fd
    } else if (isNull(obj)) {
        if (!cfg.nullsAsUndefineds) {
            fd.append(pre, '')
        }
    } else if (isBoolean(obj)) {
        if (cfg.booleansAsIntegers) {
            fd.append(pre, obj ? 1 : 0)
        } else {
            fd.append(pre, obj)
        }
    } else if (isArray(obj)) {
        if (obj.length) {
            obj.forEach((value, index) => {
                let key = pre + '[' + (cfg.indices ? index : '') + ']'

                if (
                    cfg.noAttributesWithArrayNotation ||
                    (cfg.noFilesWithArrayNotation && isFile(value, isReactNative))
                ) {
                    key = pre
                }

                objToFD(value, cfg, fd, key)
            })
        } else if (cfg.allowEmptyArrays) {
            fd.append(cfg.noAttributesWithArrayNotation ? pre : pre + '[]', '')
        }
    } else if (isDate(obj)) {
        fd.append(pre, obj.toISOString())
    } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
        Object.keys(obj).forEach((prop) => {
            const value = obj[prop]

            if (isArray(value)) {
                while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
                    prop = prop.substring(0, prop.length - 2)
                }
            }

            const key = pre
                ? cfg.dotsForObjectNotation
                    ? pre + '.' + prop
                    : pre + '[' + prop + ']'
                : prop

            objToFD(value, cfg, fd, key)
        })
    } else {
        fd.append(pre, obj)
    }

    return fd
}

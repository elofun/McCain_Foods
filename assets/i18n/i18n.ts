import { ID } from './data/ID'
import { EN } from './data/EN'
import { RU } from './data/RU'
import { Enum, EventTarget } from 'cc'

export const i18n_TEXT_KEYS = Enum(ID)
export const i18n_LANGUAGES = Enum({
    EN: 0,
    RU: 1
})

const i18n_EVENTS = Enum({
    LANGUAGE_CHANGE: 'i18n_language_changed'
})

export type i18n_PARAMS = {
    find: string,
    replace: string | number
}

export class i18n
{
    private static data = EN
    private static currentLanguage = i18n_LANGUAGES.EN

    private static evt = new EventTarget()

    private static findKey(value: number): string 
    {
        const result: string = Object.keys(ID).find(key => ID[key] === value) || ''
        return result
    }

    static init(language: number): void
    {
        if (i18n.currentLanguage === language)
        {
            return
        }

        switch (language)
        {
            case i18n_LANGUAGES.RU:
                i18n.data = RU
                i18n.currentLanguage = i18n_LANGUAGES.RU
                break;

            default:
                i18n.data = EN
                i18n.currentLanguage = i18n_LANGUAGES.EN
                break;
        }

        i18n.evt.emit(i18n_EVENTS.LANGUAGE_CHANGE, i18n.currentLanguage)
    }

    static t(key: number, params?: i18n_PARAMS[]): string
    {
        let result = i18n.data[i18n.findKey(key)]

        if (params)
        {
            params.forEach(param => {
                // console.log('param find', param.find, 'replace', param.replace)
                result = result.replace(param.find, param.replace)
            })
        }

        return result
    }

    static get language(): number
    {
        return i18n.currentLanguage
    }

    static onLanguageChanged(callback: ((language: number) => void), target: any)
    {
        i18n.evt.on(i18n_EVENTS.LANGUAGE_CHANGE, callback, target)
    }

    static offLanguageChanged(callback: ((language: number) => void), target: any)
    {
        i18n.evt.off(i18n_EVENTS.LANGUAGE_CHANGE, callback, target)
    }
}

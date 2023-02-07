
import { _decorator, Component, Node, Label, Enum, HorizontalTextAlignment, RichTextComponent } from 'cc';
import { RichText } from '../../override_engine/cocos/2d';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;


import { i18n, i18n_TEXT_KEYS, i18n_LANGUAGES, i18n_PARAMS } from './i18n';



@ccclass('LabelLocalized')
@requireComponent(Label)
@executeInEditMode(true)
export class LabelLocalized extends Component {
    @property({
        serializable: true
    })
    private _language = 0;

    @property({
        type: i18n_LANGUAGES,
        readonly: true,
        tooltip: 'Change current language by i18n.init function'
    })
    get language(): number {
        return this._language
    }
    set language(value: number) {
        if (this._language === value) {
            return
        }

        this._language = value
        this._updateLanguage()
    }

    @property({
        serializable: true
    })
    private _textKey = 0;

    @property({
        type: i18n_TEXT_KEYS,
        tooltip: 'Change text ID'
    })
    get textKey(): number {
        return this._textKey
    }
    set textKey(value: number) {
        if (this._textKey === value) {
            return
        }

        this._textKey = value
        this._updateText()
    }

    private _params: i18n_PARAMS[] | null = null
    private _label: Label | null = null
    private _richText: RichTextComponent | null = null

    private text: String = ''

    updateParams(params: i18n_PARAMS[] | null) {
        this._params = params
        this._updateText()
    }

    private _updateText() {
        if (this._label) {
            this._label.string = i18n.t(this._textKey, this._params)
        }

        if (this._richText) {
            this._richText.string = this.text.replace('Advertisement',i18n.t(this._textKey, this._params))
        }
    }

    private _updateLanguage() {
        i18n.init(this._language)

        this._updateText()
    }

    private _onLanguageChanged(language: number) {
        this._updateText()
    }

    onLoad() {
        this._label = this.getComponent(Label)
        this._richText = this.getComponent(RichTextComponent)

        this.text = this._richText.string

        // console.log('onLanguageChanged', this.node.name, 'key', this.textKey)
        i18n.onLanguageChanged(this._onLanguageChanged, this)
    }

    onDestroy() {
        // console.log('offLanguageChanged', this.node.name, 'key', this.textKey)
        i18n.offLanguageChanged(this._onLanguageChanged, this)
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

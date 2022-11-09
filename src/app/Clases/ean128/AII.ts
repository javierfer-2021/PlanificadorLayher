

export class AII {
    public AICode: string;
    public minLength: number;
    public maxLength: number;
    public Desc: string;
    public TipoDato: string;

    constructor(_AICode: string = null, _minLength: number = null, _maxLength: number = null,
        _Desc: string = null, _TipoDato: string = null
    ) {
        this.AICode = _AICode;
        this.minLength = _minLength;
        this.maxLength = _maxLength;
        this.Desc = _Desc;
        this.TipoDato = _TipoDato;
    }

}

export class PopUpOptions {
    constructor(title: string, subTitle: string, options: string[], setUserInput: (input: string) => void, extraProps: any = {}){
        this.title = title
        this.subTitle = subTitle
        this.options = options
        this.extraProps = extraProps
        this.setUserInput = setUserInput
    }
    title: string
    subTitle: string
    options: string[]
    setUserInput: (input: string) => void
    extraProps: any
}
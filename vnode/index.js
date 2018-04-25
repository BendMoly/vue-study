class Vue {
  constructor(options){
    this.el = options.el;
    this.data = options.data;
    this.init();
  }

  init(){
    let ast = this.exchangeAST();
    // this.render(ast);
  }

  exchangeAST(){
    let element = document.querySelector(this.el);
    let handler = new htmlparser.DefaultHandler({ verbose: false, ignoreWhitespace: true });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(element.innerHTML);

    this.render(handler.dom);
  }

  render(ast){
    let element = document.querySelector(this.el);
    return new VNode(ast, element, this.data);
  }
}

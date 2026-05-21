```plantuml
class Controller {
	+run()
	+init()
	+handleRequest()
}

class Command {
	+execute(request: Request)
	#doExecute(request: Request)
}

class DoAthing {
	#doExecute(request: Request)
}

class DoAnotherThing {
	#doExecute(request: Request)
}

DoAthing <|-- Command
DoAnotherThing <|-- Command

Controller ..|> Command : Создает
```
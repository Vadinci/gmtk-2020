let StateMachine = function (context) {
	let _context = context || {};
	let _states = {};
	let _currentState = undefined;

	let addState = function (Klass) {
		let state = new Klass(_context, machine);
		_states[Klass.key] = state;
	}

	let setState = function (key, force) {
		if (_currentState && _currentState.key === key && !force) return;

		if (_currentState) {
			_currentState.end();
		}
		_currentState = _states[key];
		if (_currentState) {
			_currentState.start();
		}
	};

	let update = function (data) {
		if (!_currentState) return;
		_currentState.update(data);
	};

	let machine = {
		addState,
		setState,

		update
	};

	Object.defineProperties(machine, {
		context: {
			get: () => _context
		}
	});

	return machine;
};

export default StateMachine
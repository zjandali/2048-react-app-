# 2048 Game React Component

This project is a React implementation of the popular 2048 game. It provides a simple, customizable component that you can easily integrate into your React applications.

## Features

- Classic 2048 game mechanics
- 4x4 grid layout
- Keyboard controls (arrow keys)
- On-screen button controls
- Game state management (playing, won, lost)
- No external dependencies

## Installation

1. Clone this repository or copy the `Game2048.js` file into your React project.
2. Make sure you have React installed in your project.

## Usage

To use the 2048 game component in your React application:

1. Import the component into your desired file:

```jsx
import Game2048 from './path/to/Game2048';
```

2. Use the component in your JSX:

```jsx
function App() {
  return (
    <div className="App">
      <Game2048 />
    </div>
  );
}
```

## Customization

The game uses inline styles for easy customization. You can modify the styles directly in the `Game2048.js` file to change colors, sizes, or layouts.

## How to Play

- Use the arrow keys on your keyboard to move the tiles.
- Alternatively, use the on-screen arrow buttons to move the tiles.
- When two tiles with the same number touch, they merge into one!
- Create a tile with the number 2048 to win the game.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](link-to-your-issues-page) if you want to contribute.

## License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
import Phaser from "phaser";
import { useStore } from "stores/app";

const store = useStore();

function launch(id) {
	class Hack extends Phaser.Scene {
		constructor() {
			super({
				key: "Hack",
			});
		}

		preload() {}

		create() {}

		update(time, delta) {}
	}

	return new Phaser.Game({
		type: Phaser.AUTO,
		parent: id,
		width: window.innerWidth,
		height: window.innerHeight,
		scene: Hack,
		pixelArt: true,
		physics: {
			default: "arcade",
			arcade: {
				gravity: { y: 0 },
			},
		},
	});
}
export { launch };

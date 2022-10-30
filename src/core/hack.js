import Phaser from "phaser";
import { useStore } from "stores/app";
import hackTileset from "assets/tilesets/tileset-extruded.png";
import hackTilemap from "assets/tilemaps/hackArea.json";

const store = useStore();

function launch(id) {
	class Hack extends Phaser.Scene {
		constructor() {
			super({
				key: "Hack",
			});
		}

		preload() {
			this.load.image("tileset", hackTileset);
			this.load.tilemapTiledJSON("tilemap", hackTilemap);
			this.load.spritesheet(
				"mySpritesheet",
				`/sprites/char${store.charId}.png`,
				{
					frameWidth: 32,
					frameHeight: 48,
				}
			);
		}

		create() {
			const map = this.make.tilemap({ key: "tilemap" });
			const tileset = map.addTilesetImage("tileset-extruded", "tileset");
			map.createLayer("Floor", tileset);
			this.walls = map
				.createLayer("Walls", tileset)
				.setCollisionByProperty({
					collides: true,
				});
			map.createLayer("Carpets", tileset);

			this.isLeader = store.email == store.teamLeader;
			if (this.isLeader) {
				this.room = "None";
				this.inviteAreas = map.filterObjects(
					"Spawns",
					(obj) =>
						obj.rectangle &&
						(obj.name == "Red" ||
							obj.name == "Purple" ||
							obj.name == "Blue")
				);
				console.log(this.inviteAreas);
				for (let area of this.inviteAreas) {
					area.rect = new Phaser.Geom.Rectangle(
						area.x,
						area.y,
						area.width,
						area.height
					);
				}
				this.spawnPoint = map.findObject(
					"Spawns",
					(obj) => obj.point && obj.name === "None"
				);
			} else {
				this.room = store.teamMembers.find(
					(val) => val.email == store.email
				);
				this.room = this.room.room;
				this.spawnPoint = map.findObject(
					"Spawns",
					(obj) => obj.point && obj.name === this.room
				);
			}

			// const debugGraphics = this.add.graphics().setAlpha(0.75);
			// this.walls.renderDebug(debugGraphics, {
			// 	tileColor: null, // Color of non-colliding tiles
			// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			// });
			// this.physics.world.createDebugGraphic();

			this.player = this.physics.add
				.sprite(this.spawnPoint.x, this.spawnPoint.y, "mySpritesheet")
				.setScale(1.5);
			this.player.body.setSize(22, 35);
			this.player.body.setOffset(5, 12);
			this.player.anims.create({
				key: "moveDown",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 0,
					end: 2,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "moveLeft",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 3,
					end: 5,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "moveRight",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 6,
					end: 8,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "moveUp",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 9,
					end: 11,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "downIdle",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 1,
					end: 1,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "leftIdle",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 4,
					end: 4,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "rightIdle",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 7,
					end: 7,
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.player.anims.create({
				key: "upIdle",
				frames: this.anims.generateFrameNumbers("mySpritesheet", {
					start: 10,
					end: 10,
				}),
				frameRate: 5,
				repeat: -1,
			});

			this.physics.add.collider(this.walls, this.player);

			const camera = this.cameras.main;
			camera.startFollow(this.player);
			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

			this.keys = this.input.keyboard.createCursorKeys();
			this.speed = 200;

			this.dir = "down";
		}

		checkInvites() {
			for (let area of this.inviteAreas) {
				if (area.rect.contains(this.player.x, this.player.y)) {
					store[area.name] = true;
				} else {
					store[area.name] = false;
				}
			}
		}

		showHeaders() {}

		update(time, delta) {
			this.player.setVelocity(0);
			if (
				this.keys.down.isDown &&
				!this.keys.left.isDown &&
				!this.keys.right.isDown &&
				!this.keys.up.isDown
			) {
				this.player.play("moveDown", true);
				this.player.setVelocityY(this.speed);
				this.dir = "down";
			}
			if (
				this.keys.up.isDown &&
				!this.keys.left.isDown &&
				!this.keys.right.isDown &&
				!this.keys.down.isDown
			) {
				this.player.play("moveUp", true);
				this.player.setVelocityY(-this.speed);
				this.dir = "up";
			}
			if (
				this.keys.left.isDown &&
				!this.keys.down.isDown &&
				!this.keys.right.isDown &&
				!this.keys.up.isDown
			) {
				this.player.play("moveLeft", true);
				this.player.setVelocityX(-this.speed);
				this.dir = "left";
			}
			if (
				this.keys.right.isDown &&
				!this.keys.left.isDown &&
				!this.keys.down.isDown &&
				!this.keys.up.isDown
			) {
				this.player.play("moveRight", true);
				this.player.setVelocityX(this.speed);
				this.dir = "right";
			}

			if (this.player.body.speed == 0) {
				this.player.play(`${this.dir}Idle`);
			}

			if (this.isLeader) this.checkInvites();

			this.showHeaders();
		}
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

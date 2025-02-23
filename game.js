const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bullets = [];
let enemies = [];
let player = { x: canvas.width / 2, y: canvas.height - 30, speed: 5, radius: 20, lives: 3 };
let keys = {};
let score = 0;

const playerImage = new Image();
playerImage.src = "images/player.png";

const bulletImage = new Image();
bulletImage.src = "images/bullet.png";

const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// 弾クラスの定義
class Bullet {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    draw() {
        ctx.drawImage(bulletImage, this.x - 5, this.y - 5, 10, 10);
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

// 敵クラスの定義
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dy = 2;
    }
    draw() {
        ctx.drawImage(enemyImage, this.x, this.y, 20, 20);
    }
    update() {
        this.y += this.dy;
    }
}

// プレイヤーの描画関数
function drawPlayer() {
    ctx.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 4, player.radius * 6);
}

// キーイベントのハンドリング
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// プレイヤーの移動
function movePlayer() {
    if (keys["ArrowUp"] && player.y - player.radius > 0) {
        player.y -= player.speed;
    }
    if (keys["ArrowDown"] && player.y + player.radius < canvas.height) {
        player.y += player.speed;
    }
    if (keys["ArrowLeft"] && player.x - player.radius > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x + player.radius < canvas.width) {
        player.x += player.speed;
    }
}

// 弾を発射する関数
function shootBullet() {
    bullets.push(new Bullet(player.x, player.y, 0, -5));
}

// 敵を生成する関数
function createEnemy() {
    const x = Math.random() * (canvas.width - 20);
    enemies.push(new Enemy(x, 0));
}

// 衝突をチェックする関数
function checkCollision(bullet, enemy) {
    return bullet.x > enemy.x && bullet.x < enemy.x + 20 && bullet.y > enemy.y && bullet.y < enemy.y + 20;
}

// プレイヤーと敵の衝突をチェックする関数
function checkPlayerCollision(player, enemy) {
    const distX = Math.abs(player.x - (enemy.x + 10));
    const distY = Math.abs(player.y - (enemy.y + 10));
    return distX < player.radius + 10 && distY < player.radius + 10;
}

// ゲームの描画関数
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();

    bullets.forEach((bullet, bulletIndex) => {
        bullet.update();
        bullet.draw();
        
        // 画面外に出た弾を削除
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(bulletIndex, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        enemy.draw();
        
        // 敵が画面外に出たら削除
        if (enemy.y > canvas.height) {
            enemies.splice(enemyIndex, 1);
        }

        // 弾が敵に当たったかチェック
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 1;
                console.log("Score:", score);
            }
        });

        // プレイヤーが敵に当たったかチェック
        if (checkPlayerCollision(player, enemy)) {
            enemies.splice(enemyIndex, 1);
            player.lives -= 1;
            console.log("Player Lives:", player.lives);
            if (player.lives <= 0) {
                console.log("Game Over");
                // ゲームオーバー処理を追加
            }
        }
    });

    // スコアとプレイヤーのライフを表示
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Lives: " + player.lives, 8, 40);
}

// ゲームループ
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

setInterval(createEnemy, 1000);
canvas.addEventListener("click", shootBullet);

// Zキーで弾を発射
document.addEventListener("keydown", (e) => {
    if (e.key === "z" || e.key === "Z") {
        shootBullet();
    }
});

gameLoop();

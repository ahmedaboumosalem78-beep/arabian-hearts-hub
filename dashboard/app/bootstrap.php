<?php
declare(strict_types=1);

const APP_ROOT = __DIR__ . '/..';
const STORAGE_DIR = APP_ROOT . '/storage';
const DB_PATH = STORAGE_DIR . '/app.sqlite';

if (!is_dir(STORAGE_DIR)) {
    mkdir(STORAGE_DIR, 0750, true);
}
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('ammar_dashboard');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'");

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    if (!is_file(DB_PATH)) throw new RuntimeException('التثبيت غير مكتمل.');
    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec('PRAGMA busy_timeout = 5000');
    return $pdo;
}

function e(mixed $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return (string)$_SESSION['csrf'];
}

function verify_csrf(): void
{
    $token = (string)($_POST['_csrf'] ?? '');
    if ($token === '' || !hash_equals(csrf_token(), $token)) {
        http_response_code(419);
        render_page('انتهت صلاحية الطلب', '<p>أعد تحميل الصفحة وحاول مرة أخرى.</p>');
        exit;
    }
}

function current_user(): ?array
{
    return isset($_SESSION['user_id']) ? db()->prepare('SELECT id, name, email, role FROM users WHERE id = ?')->execute([$_SESSION['user_id']]) : null;
}

function user_row(): ?array
{
    if (!isset($_SESSION['user_id'])) return null;
    $stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function require_login(): array
{
    $user = user_row();
    if (!$user) go('/login');
    return $user;
}

function require_admin(): array
{
    $user = require_login();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        render_page('غير مسموح', '<p>هذه الصفحة مخصصة لمدير الموقع.</p>');
        exit;
    }
    return $user;
}

function go(string $path): never
{
    header('Location: ' . $path, true, 303);
    exit;
}

function flash(string $message, string $kind = 'ok'): void
{
    $_SESSION['flash'] = ['message' => $message, 'kind' => $kind];
}

function render_page(string $title, string $body, bool $admin = false): void
{
    $user = $admin ? user_row() : null;
    $notice = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    ?><!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= e($title) ?> | ونش إنقاذ الإسماعيلية</title><link rel="stylesheet" href="/public/style.css"></head><body>
    <header class="top"><a class="brand" href="/admin">ونش إنقاذ الإسماعيلية <small>عمار أبو مسلم</small></a><?php if ($user): ?><div class="top-actions"><span><?= e($user['name']) ?></span><form method="post" action="/logout"><input type="hidden" name="_csrf" value="<?= e(csrf_token()) ?>"><button class="quiet" type="submit">خروج</button></form></div><?php endif; ?></header>
    <main class="wrap"><h1><?= e($title) ?></h1><?php if ($notice): ?><div class="notice <?= e($notice['kind']) ?>"><?= e($notice['message']) ?></div><?php endif; ?><?= $body ?></main>
    <footer>لوحة إدارة مستقلة — ونش إنقاذ الإسماعيلية</footer></body></html><?php
}

function install_schema(PDO $pdo): void
{
    $pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ("admin","editor")), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
    $pdo->exec('CREATE TABLE content (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL CHECK(type IN ("service","coverage","post")), title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT NOT NULL DEFAULT "", body TEXT NOT NULL DEFAULT "", status TEXT NOT NULL DEFAULT "published" CHECK(status IN ("published","draft")), image TEXT NOT NULL DEFAULT "", created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
    $pdo->exec('CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
}

function seed_initial_content(PDO $pdo): void
{
    $services = [
        ['service','ونش إنقاذ سيارات','car-towing','سحب ونقل السيارات الملاكي بأمان داخل الإسماعيلية وعلى الطرق والمحاور الرئيسية.','نستقبل طلبك ونحدد موقعك ونوع السيارة وطبيعة العطل، ثم نختار طريقة النقل المناسبة.'],
        ['service','ونش نقل معدات ثقيلة','heavy-equipment-transport','نقل المعدات والآلات الثقيلة باستخدام التجهيزات المناسبة لكل نوع وحجم.','نقل المعدات الصناعية ومعدات البناء والزراعة والماكينات من وإلى مواقع العمل.'],
        ['service','سطحة ونقل سيارات','car-transport','نقل السيارات من موقع إلى آخر بأمان داخل الإسماعيلية والمحافظات القريبة.','السطحة ترفع السيارة بالكامل للنقل داخل المدينة وبين المحافظات.'],
        ['service','مساعدة على الطريق','roadside-assistance','خدمة طوارئ الطريق للسيارات المتعطلة على المحاور والطرق السريعة على مدار الساعة.','حدد الطريق والاتجاه وأقرب علامة مميزة عند طلب الخدمة.'],
    ];
    $areas = [
        ['coverage','الإسماعيلية','ismailia','خدمة ونش وسحب سيارات وسطحة داخل مدينة الإسماعيلية وأحيائها والطرق المحيطة.','تغطية المدينة والطرق الداخلية والمحاور المحيطة.'],
        ['coverage','العاشر من رمضان','10th-of-ramadan','سحب ونقل السيارات والمعدات داخل مدينة العاشر من رمضان والمناطق الصناعية.','خدمات السيارات والمعدات داخل المدينة والمناطق الصناعية.'],
        ['coverage','محور 30 يونيو','30-june-axis','استجابة لأعطال وحوادث السيارات على محور 30 يونيو والطرق المتصلة به.','خدمات السحب والنقل على المحور والطرق المتصلة.'],
        ['coverage','طريق القاهرة الإسماعيلية','cairo-ismailia-road','ونش إنقاذ وسحب سيارات على طريق القاهرة الإسماعيلية الصحراوي والزراعي.','تغطية الطريق الصحراوي والزراعي والطرق المؤدية للإسماعيلية.'],
    ];
    $posts = [
        ['post','ماذا تفعل إذا تعطلت سيارتك على الطريق؟','car-breakdown-on-road','خطوات عملية تحافظ على سلامتك لحين وصول ونش الإنقاذ.','شغّل إشارات التحذير، وضع المثلث العاكس، وانتظر في مكان آمن بعيدًا عن مسار السيارات. حدد الطريق والاتجاه وأقرب علامة عند الاتصال.'],
        ['post','كيفية اختيار ونش مناسب لسحب السيارة','choose-the-right-tow-truck','نوع السيارة وحالة العطل يحددان نوع الونش المناسب.','حدد نوع سيارتك وحالتها ومكانها عند الاتصال حتى يتم اختيار طريقة النقل المناسبة.'],
        ['post','نصائح قبل نقل المعدات الثقيلة','heavy-equipment-transport-tips','التجهيز الجيد قبل النقل يساعد على تنظيم عملية التحميل.','حدد الوزن والأبعاد وموقعي التحميل والتفريغ قبل ترتيب نقل المعدة.'],
    ];
    $insert = $pdo->prepare('INSERT INTO content(type,title,slug,excerpt,body,status) VALUES(?,?,?,?,?,"published")');
    foreach (array_merge($services, $areas, $posts) as $row) $insert->execute($row);
    $settings = $pdo->prepare('INSERT INTO settings(key,value) VALUES(?,?)');
    foreach (['brand_name'=>'عمار أبو مسلم','site_name'=>'ونش إنقاذ الإسماعيلية','phone_primary'=>'01231035306','phone_secondary'=>'01231035305','whatsapp'=>'201231035306'] as $key => $value) $settings->execute([$key,$value]);
}

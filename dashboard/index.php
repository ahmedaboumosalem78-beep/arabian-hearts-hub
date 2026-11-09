<?php
declare(strict_types=1);
require __DIR__ . '/app/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$installed = is_file(DB_PATH);
if ($path === '/install' || $path === '/') {
    if ($installed) go(isset($_SESSION['user_id']) ? '/admin' : '/login');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        verify_csrf();
        $name = trim((string)($_POST['name'] ?? ''));
        $email = strtolower(trim((string)($_POST['email'] ?? '')));
        $password = (string)($_POST['password'] ?? '');
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 12) {
            flash('أدخل اسمًا وبريدًا صحيحًا وكلمة مرور من 12 حرفًا على الأقل.', 'error'); go('/install');
        }
        try {
            $pdo = new PDO('sqlite:' . DB_PATH, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->beginTransaction();
            install_schema($pdo);
            $stmt = $pdo->prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,"admin")');
            $stmt->execute([$name,$email,password_hash($password, PASSWORD_DEFAULT)]);
            seed_initial_content($pdo);
            $pdo->commit();
            chmod(DB_PATH, 0640);
            session_regenerate_id(true);
            $userStmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $userStmt->execute([$email]);
            $_SESSION['user_id'] = (int)$userStmt->fetchColumn();
            flash('تم إعداد اللوحة بنجاح.'); go('/admin');
        } catch (Throwable $error) {
            if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
            if (is_file(DB_PATH) && filesize(DB_PATH) === 0) unlink(DB_PATH);
            error_log('Installer error: ' . $error->getMessage());
            flash('تعذر إتمام الإعداد. تأكد من صلاحيات مجلد storage ثم حاول مجددًا.', 'error'); go('/install');
        }
    }
    render_page('إعداد لوحة الإدارة', '<section class="panel narrow"><p>أنشئ حساب المدير الأول. لا توجد كلمة مرور افتراضية.</p><form method="post"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><label>الاسم<input name="name" required maxlength="120"></label><label>البريد الإلكتروني<input type="email" name="email" required maxlength="190"></label><label>كلمة المرور (12 حرفًا على الأقل)<input type="password" name="password" minlength="12" required autocomplete="new-password"></label><button class="primary">إنشاء اللوحة</button></form></section>');
    exit;
}

if ($path === '/login') {
    if (!$installed) go('/install');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        verify_csrf();
        $email = strtolower(trim((string)($_POST['email'] ?? '')));
        $stmt = db()->prepare('SELECT id,password_hash FROM users WHERE email = ?'); $stmt->execute([$email]); $user = $stmt->fetch();
        if ($user && password_verify((string)($_POST['password'] ?? ''), $user['password_hash'])) {
            session_regenerate_id(true); $_SESSION['user_id'] = (int)$user['id']; go('/admin');
        }
        usleep(250000); flash('بيانات الدخول غير صحيحة.', 'error'); go('/login');
    }
    render_page('تسجيل الدخول', '<section class="panel narrow"><form method="post"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><label>البريد الإلكتروني<input type="email" name="email" required autocomplete="username"></label><label>كلمة المرور<input type="password" name="password" required autocomplete="current-password"></label><button class="primary">دخول</button></form></section>'); exit;
}

if (str_starts_with($path, '/api/v1/')) {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=60');
    if (!$installed) { http_response_code(503); echo json_encode(['error'=>'not_installed'], JSON_UNESCAPED_UNICODE); exit; }
    if ($path === '/api/v1/content' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $type = (string)($_GET['type'] ?? '');
        if (!in_array($type, ['service','coverage','post'], true)) { http_response_code(400); echo json_encode(['error'=>'invalid_type']); exit; }
        $stmt = db()->prepare('SELECT type,title,slug,excerpt,body,image,updated_at FROM content WHERE type = ? AND status = "published" ORDER BY id'); $stmt->execute([$type]);
        echo json_encode(['data'=>$stmt->fetchAll()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit;
    }
    if ($path === '/api/v1/settings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $rows = db()->query('SELECT key,value FROM settings')->fetchAll(); $data=[]; foreach ($rows as $row) $data[$row['key']]=$row['value'];
        echo json_encode(['data'=>$data], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit;
    }
    http_response_code(404); echo json_encode(['error'=>'not_found']); exit;
}

if (!$installed) go('/install');
if ($path === '/logout' && $_SERVER['REQUEST_METHOD'] === 'POST') { verify_csrf(); $_SESSION=[]; session_regenerate_id(true); go('/login'); }
$user = require_login();
if ($path === '/admin' || $path === '/admin/') {
    $counts = db()->query('SELECT type,COUNT(*) AS total FROM content GROUP BY type')->fetchAll(); $byType=[]; foreach ($counts as $row) $byType[$row['type']]=$row['total'];
    $body = '<section class="stats"><div><b>'.(int)($byType['service']??0).'</b><span>خدمات</span></div><div><b>'.(int)($byType['coverage']??0).'</b><span>مناطق التغطية</span></div><div><b>'.(int)($byType['post']??0).'</b><span>مقالات</span></div></section><nav class="nav"><a href="/admin/content">إدارة المحتوى</a>'.($user['role']==='admin'?'<a href="/admin/settings">بيانات الاتصال</a><a href="/admin/users">المستخدمون</a><a href="/admin/backup">نسخة احتياطية</a>':'').'</nav><p class="muted">واجهة API العامة: <code>/api/v1/content?type=service</code></p>';
    render_page('لوحة الإدارة', $body, true); exit;
}

if ($path === '/admin/content') {
    $types=['service'=>'خدمة','coverage'=>'منطقة','post'=>'مقال'];
    if ($_SERVER['REQUEST_METHOD']==='POST') {
        verify_csrf(); $action=(string)($_POST['action']??'');
        if ($action==='delete') { $id=(int)($_POST['id']??0); $stmt=db()->prepare('DELETE FROM content WHERE id=?'); $stmt->execute([$id]); flash('تم حذف العنصر.'); go('/admin/content'); }
        $id=(int)($_POST['id']??0); $type=(string)($_POST['type']??''); $title=trim((string)($_POST['title']??'')); $slug=trim((string)($_POST['slug']??'')); $excerpt=trim((string)($_POST['excerpt']??'')); $body=trim((string)($_POST['body']??'')); $status=(string)($_POST['status']??'published');
        if (!isset($types[$type]) || $title==='' || !preg_match('/^[a-z0-9-]{2,100}$/',$slug) || !in_array($status,['published','draft'],true)) { flash('تحقق من نوع المحتوى والعنوان والرابط اللاتيني.', 'error'); go('/admin/content'); }
        $image='';
        if (!empty($_FILES['image']['name'])) {
            $file=$_FILES['image'];
            if (($file['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK || ($file['size']??0)>5*1024*1024) { flash('الصورة كبيرة جدًا أو تعذر رفعها (الحد 5 ميجابايت).','error'); go('/admin/content'); }
            $finfo=new finfo(FILEINFO_MIME_TYPE); $mime=$finfo->file($file['tmp_name']); $allowed=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
            if (!isset($allowed[$mime]) || @getimagesize($file['tmp_name'])===false) { flash('صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP أو GIF.','error'); go('/admin/content'); }
            $dir=APP_ROOT.'/uploads'; if (!is_dir($dir)) mkdir($dir,0750,true); $filename=bin2hex(random_bytes(18)).'.'.$allowed[$mime];
            if (!move_uploaded_file($file['tmp_name'],$dir.'/'.$filename)) { flash('تعذر حفظ الصورة.','error'); go('/admin/content'); }
            $image='/uploads/'.$filename;
        } elseif ($id>0) { $stmt=db()->prepare('SELECT image FROM content WHERE id=?'); $stmt->execute([$id]); $image=(string)($stmt->fetchColumn()?:''); }
        try {
            if ($id>0) { $stmt=db()->prepare('UPDATE content SET type=?,title=?,slug=?,excerpt=?,body=?,status=?,image=?,updated_at=CURRENT_TIMESTAMP WHERE id=?'); $stmt->execute([$type,$title,$slug,$excerpt,$body,$status,$image,$id]); }
            else { $stmt=db()->prepare('INSERT INTO content(type,title,slug,excerpt,body,status,image) VALUES(?,?,?,?,?,?,?)'); $stmt->execute([$type,$title,$slug,$excerpt,$body,$status,$image]); }
            flash('تم حفظ المحتوى.');
        } catch (PDOException $error) { flash('تعذر الحفظ؛ قد يكون الرابط مستخدمًا من عنصر آخر.','error'); }
        go('/admin/content');
    }
    $editId=(int)($_GET['edit']??0); $editing=null;
    if ($editId) { $stmt=db()->prepare('SELECT * FROM content WHERE id=?'); $stmt->execute([$editId]); $editing=$stmt->fetch() ?: null; }
    $v=fn(string $key,string $fallback='')=>e($editing[$key]??$fallback);
    $form='<section class="panel"><h2>'.($editing?'تعديل المحتوى':'إضافة محتوى').'</h2><form method="post" enctype="multipart/form-data"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><input type="hidden" name="id" value="'.(int)($editing['id']??0).'"><div class="grid"><label>النوع<select name="type">'; foreach($types as $key=>$label) $form.='<option value="'.e($key).'"'.(($editing['type']??'service')===$key?' selected':'').'>'.e($label).'</option>'; $form.='</select></label><label>الحالة<select name="status"><option value="published"'.(($editing['status']??'published')==='published'?' selected':'').'>منشور</option><option value="draft"'.(($editing['status']??'')==='draft'?' selected':'').'>مسودة</option></select></label><label>العنوان<input name="title" required maxlength="220" value="'.$v('title').'"></label><label>الرابط (أحرف لاتينية)<input name="slug" required pattern="[a-z0-9-]{2,100}" value="'.$v('slug').'"></label></div><label>مقتطف<textarea name="excerpt" rows="2">'.$v('excerpt').'</textarea></label><label>النص<textarea name="body" rows="5">'.$v('body').'</textarea></label><label>صورة (حتى 5MB)<input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif"></label>'.(!empty($editing['image'])?'<p><img class="thumb" src="'.e($editing['image']).'" alt="الصورة الحالية"></p>':'').'<button class="primary">حفظ</button>'.($editing?'<a class="button" href="/admin/content">إلغاء</a>':'').'</form></section>';
    $rows=db()->query('SELECT id,type,title,slug,status,image,updated_at FROM content ORDER BY id DESC')->fetchAll(); $list='<section><h2>المحتوى الحالي</h2><div class="table-wrap"><table><thead><tr><th>النوع</th><th>العنوان</th><th>الحالة</th><th>آخر تعديل</th><th>إجراء</th></tr></thead><tbody>';
    foreach($rows as $row){$list.='<tr><td>'.e($types[$row['type']]??$row['type']).'</td><td>'.e($row['title']).'<small class="block">'.e($row['slug']).'</small></td><td>'.($row['status']==='published'?'منشور':'مسودة').'</td><td>'.e($row['updated_at']).'</td><td><a href="/admin/content?edit='.(int)$row['id'].'">تعديل</a> <form class="inline" method="post" onsubmit="return confirm(\'حذف هذا العنصر؟\')"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="'.(int)$row['id'].'"><button class="danger">حذف</button></form></td></tr>';}
    $list.='</tbody></table></div></section><p><a href="/admin">العودة للوحة</a></p>'; render_page('إدارة المحتوى',$form.$list,true); exit;
}

if ($path === '/admin/settings') {
    require_admin();
    if ($_SERVER['REQUEST_METHOD']==='POST') { verify_csrf(); $fields=['site_name','brand_name','phone_primary','phone_secondary','whatsapp']; $stmt=db()->prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value'); foreach($fields as $key){$value=trim((string)($_POST[$key]??'')); if($value!=='' && strlen($value)<=180) $stmt->execute([$key,$value]);} flash('تم حفظ بيانات الاتصال.'); go('/admin/settings'); }
    $settings=[]; foreach(db()->query('SELECT key,value FROM settings')->fetchAll() as $row) $settings[$row['key']]=$row['value']; $body='<section class="panel narrow"><form method="post"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'">'; foreach(['site_name'=>'اسم الموقع','brand_name'=>'الاسم التجاري','phone_primary'=>'الهاتف الأساسي','phone_secondary'=>'الهاتف الآخر','whatsapp'=>'واتساب (مفتاح الدولة)'] as $key=>$label) $body.='<label>'.e($label).'<input name="'.e($key).'" value="'.e($settings[$key]??'').'"></label>'; $body.='<button class="primary">حفظ</button></form></section><p><a href="/admin">العودة للوحة</a></p>'; render_page('بيانات الموقع والاتصال',$body,true); exit;
}

if ($path === '/admin/users') {
    require_admin();
    if ($_SERVER['REQUEST_METHOD']==='POST') { verify_csrf(); $name=trim((string)($_POST['name']??'')); $email=strtolower(trim((string)($_POST['email']??''))); $password=(string)($_POST['password']??''); $role=(string)($_POST['role']??'editor'); if($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($password)<12||!in_array($role,['admin','editor'],true)){flash('تحقق من البيانات؛ كلمة المرور يجب ألا تقل عن 12 حرفًا.','error'); go('/admin/users');} try{$stmt=db()->prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');$stmt->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT),$role]);flash('تم إنشاء المستخدم.');}catch(PDOException){flash('هذا البريد مسجل بالفعل.','error');} go('/admin/users'); }
    $users=db()->query('SELECT name,email,role,created_at FROM users ORDER BY id')->fetchAll(); $body='<section class="panel narrow"><h2>إضافة مستخدم</h2><form method="post"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><label>الاسم<input name="name" required></label><label>البريد الإلكتروني<input type="email" name="email" required></label><label>كلمة مرور قوية (12 حرفًا على الأقل)<input type="password" name="password" minlength="12" required></label><label>الصلاحية<select name="role"><option value="editor">محرر محتوى</option><option value="admin">مدير</option></select></label><button class="primary">إضافة المستخدم</button></form></section><section><h2>المستخدمون</h2><div class="table-wrap"><table><thead><tr><th>الاسم</th><th>البريد</th><th>الصلاحية</th></tr></thead><tbody>'; foreach($users as $item)$body.='<tr><td>'.e($item['name']).'</td><td>'.e($item['email']).'</td><td>'.($item['role']==='admin'?'مدير':'محرر محتوى').'</td></tr>'; $body.='</tbody></table></div></section><p><a href="/admin">العودة للوحة</a></p>'; render_page('المستخدمون والصلاحيات',$body,true); exit;
}

if ($path === '/admin/backup') {
    require_admin();
    if ($_SERVER['REQUEST_METHOD']==='POST') {
        verify_csrf();
        if (!class_exists('ZipArchive')) { http_response_code(500); render_page('تعذر إنشاء النسخة','<p>خدمة ZIP غير مفعلة على الخادم؛ اطلب تفعيل امتداد PHP zip من شركة الاستضافة.</p>',true); exit; }
        $backupDir=STORAGE_DIR.'/backups'; if(!is_dir($backupDir))mkdir($backupDir,0750,true); $name='backup-'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(3)).'.zip'; $pathOut=$backupDir.'/'.$name; $dbCopy=$backupDir.'/snapshot-'.bin2hex(random_bytes(5)).'.sqlite';
        try { $pdo=db(); $quoted=str_replace("'","''",$dbCopy); $pdo->exec("VACUUM INTO '$quoted'"); $zip=new ZipArchive(); if($zip->open($pathOut,ZipArchive::CREATE|ZipArchive::EXCL)!==true)throw new RuntimeException('zip'); $zip->addFile($dbCopy,'database.sqlite'); $uploadRoot=APP_ROOT.'/uploads'; if(is_dir($uploadRoot)){ $iterator=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadRoot,FilesystemIterator::SKIP_DOTS)); foreach($iterator as $file){if($file->isFile())$zip->addFile($file->getPathname(),'uploads/'.substr($file->getPathname(),strlen($uploadRoot)+1));} } $zip->addFromString('README.txt',"نسخة احتياطية للوحة ونش إنقاذ الإسماعيلية\nاحفظ هذا الملف في مكان آمن؛ يحتوي على قاعدة البيانات والوسائط.\n"); $zip->close(); unlink($dbCopy); chmod($pathOut,0600); header('Content-Type: application/zip'); header('Content-Disposition: attachment; filename="'.$name.'"'); header('Content-Length: '.filesize($pathOut)); readfile($pathOut); exit; }
        catch(Throwable $error){if(is_file($dbCopy))unlink($dbCopy);if(is_file($pathOut))unlink($pathOut);error_log('Backup error: '.$error->getMessage());http_response_code(500);render_page('تعذر إنشاء النسخة','<p>تعذر تجهيز النسخة الاحتياطية. تحقق من المساحة وصلاحيات مجلد storage.</p>',true);exit;}
    }
    render_page('نسخة احتياطية','<section class="panel narrow"><p>تنزيل ملف ZIP يحتوي على قاعدة البيانات وصور الموقع المحفوظة.</p><form method="post"><input type="hidden" name="_csrf" value="'.e(csrf_token()).'"><button class="primary">إنشاء وتنزيل نسخة</button></form></section><p><a href="/admin">العودة للوحة</a></p>',true); exit;
}

http_response_code(404); render_page('الصفحة غير موجودة','<p>الرابط غير متاح.</p>');

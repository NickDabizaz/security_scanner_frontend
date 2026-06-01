/**
 * Repository scan catalog (100 defensive static-analysis checks).
 *
 * This list mirrors the backend rule catalog in
 * `backend/src/scanners/repositoryRules.js`. Each entry carries:
 *  - `ruleId`  : stable id sent to the backend as part of `selectedRules`.
 *  - `group`   : visual cluster shown in the scan selector.
 *  - `tier`    : 'FREE' (selectable on every plan) or 'PRO' (premium only).
 *  - `severity`: default severity used for badges/sorting.
 *
 * The backend exposes the authoritative catalog via `GET /api/scans/rules`;
 * this static copy is the offline fallback so the UI always renders.
 */
export const repositoryScanCatalog = [
  { id: '01', ruleId: 'insecure-cookie-flags', group: 'Auth & Session', tier: 'PRO', severity: 'Medium', title: 'Insecure Cookie Flags Configuration', detail: 'Konfigurasi cookie terdeteksi menonaktifkan flag HttpOnly atau Secure.' },
  { id: '02', ruleId: 'hardcoded-jwt-secret', group: 'Auth & Session', tier: 'FREE', severity: 'High', title: 'Hardcoded JWT Secret Key', detail: 'Kunci penandatanganan JWT terlihat ditulis langsung di source code.' },
  { id: '03', ruleId: 'sql-injection-concatenation', group: 'Injection & Execution', tier: 'FREE', severity: 'High', title: 'Potential SQL Injection via Concatenation', detail: 'Query SQL terlihat dibangun dengan concatenation atau interpolasi string.' },
  { id: '04', ruleId: 'dynamic-eval', group: 'Injection & Execution', tier: 'FREE', severity: 'Critical', title: 'Dynamic Code Evaluation (eval)', detail: 'Pemanggilan eval() terdeteksi pada source code.' },
  { id: '05', ruleId: 'unsafe-node-command', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Unsafe Node.js Command Execution', detail: 'Pemanggilan child process Node.js menerima string yang berpotensi dinamis.' },
  { id: '06', ruleId: 'hardcoded-api-credential', group: 'Secrets & Credentials', tier: 'FREE', severity: 'High', title: 'Hardcoded API Secret or Credential', detail: 'Nilai kredensial generik terlihat ditulis langsung di source code.' },
  { id: '07', ruleId: 'committed-env-file', group: 'Configuration & Exposure', tier: 'FREE', severity: 'High', title: 'Committed Environment File (.env)', detail: 'File environment aktif tersimpan di dalam arsip repository.' },
  { id: '08', ruleId: 'hardcoded-internal-endpoint', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Hardcoded Internal or Staging Endpoint', detail: 'URL internal, development, staging, atau localhost ditulis langsung di source code.' },
  { id: '09', ruleId: 'wildcard-cors', group: 'Configuration & Exposure', tier: 'FREE', severity: 'Medium', title: 'Unrestricted CORS Wildcard', detail: 'Konfigurasi CORS terlihat mengizinkan origin wildcard.' },
  { id: '10', ruleId: 'debug-mode-enabled', group: 'Configuration & Exposure', tier: 'FREE', severity: 'Low', title: 'Development Debug Mode Enabled', detail: 'Flag debug atau stack trace terlihat diaktifkan.' },
  { id: '11', ruleId: 'weak-password-hashing', group: 'Cryptography', tier: 'FREE', severity: 'High', title: 'Weak Password Hashing Algorithm', detail: 'Algoritme MD5 atau SHA-1 terlihat digunakan untuk hashing password.' },
  { id: '12', ruleId: 'hardcoded-password', group: 'Secrets & Credentials', tier: 'FREE', severity: 'High', title: 'Hardcoded Password Value', detail: 'Variabel password terlihat berisi literal string non-contoh.' },
  { id: '13', ruleId: 'disabled-tls-verification', group: 'Cryptography', tier: 'FREE', severity: 'High', title: 'Disabled TLS Certificate Verification', detail: 'Validasi sertifikat TLS terlihat dimatikan.' },
  { id: '14', ruleId: 'embedded-private-key', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'Embedded Private Key Material', detail: 'Blok private key terlihat berada di file repository.' },
  { id: '15', ruleId: 'github-access-token', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'GitHub Access Token Pattern', detail: 'Pola token akses GitHub terlihat di source code.' },
  { id: '16', ruleId: 'stripe-secret-key', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'Stripe Secret Key Pattern', detail: 'Pola secret key Stripe terlihat di file repository.' },
  { id: '17', ruleId: 'slack-token-webhook', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Slack Token or Webhook Pattern', detail: 'Token Slack atau URL incoming webhook terlihat di repository.' },
  { id: '18', ruleId: 'google-api-key', group: 'Secrets & Credentials', tier: 'FREE', severity: 'High', title: 'Google API Key Pattern', detail: 'Pola Google API key terlihat di file repository.' },
  { id: '19', ruleId: 'database-connection-string', group: 'Secrets & Credentials', tier: 'FREE', severity: 'High', title: 'Database Connection String in Source', detail: 'Connection string database terlihat berada di file repository.' },
  { id: '20', ruleId: 'committed-private-key-file', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'Committed Private Key File', detail: 'Nama file private key umum ditemukan dalam repository.' },
  { id: '21', ruleId: 'committed-backup-file', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Committed Backup or Temporary File', detail: 'File backup atau temporary ditemukan di dalam repository.' },
  { id: '22', ruleId: 'committed-npm-token', group: 'Secrets & Credentials', tier: 'PRO', severity: 'Critical', title: 'Committed npm Authentication Token', detail: 'File .npmrc dengan token registry ditemukan di repository.' },
  { id: '23', ruleId: 'committed-aws-credentials', group: 'Secrets & Credentials', tier: 'PRO', severity: 'Critical', title: 'Committed AWS Credentials File', detail: 'Path file credential AWS ditemukan dalam repository.' },
  { id: '24', ruleId: 'sftp-credentials', group: 'Secrets & Credentials', tier: 'PRO', severity: 'Critical', title: 'Committed SFTP Credentials File', detail: 'Konfigurasi koneksi SFTP editor ditemukan dalam repository.' },
  { id: '25', ruleId: 'sql-template-interpolation', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'SQL Query Template Interpolation', detail: 'Template literal SQL terlihat memuat interpolasi variabel.' },
  { id: '26', ruleId: 'nosql-where-evaluation', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'NoSQL $where Evaluation', detail: 'Operator MongoDB $where terlihat digunakan.' },
  { id: '27', ruleId: 'path-traversal-file-access', group: 'Input & Request Safety', tier: 'PRO', severity: 'High', title: 'Dynamic File Access from Request Input', detail: 'Operasi file terlihat menerima nilai langsung dari request.' },
  { id: '28', ruleId: 'unsafe-python-deserialization', group: 'Injection & Execution', tier: 'PRO', severity: 'Critical', title: 'Unsafe Python Pickle Deserialization', detail: 'Pemanggilan pickle.loads() atau pickle.load() terdeteksi.' },
  { id: '29', ruleId: 'unsafe-yaml-load', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Unsafe YAML Deserialization', detail: 'Loader YAML umum terlihat digunakan tanpa safe loader.' },
  { id: '30', ruleId: 'dom-inner-html', group: 'Injection & Execution', tier: 'FREE', severity: 'Medium', title: 'DOM innerHTML Assignment', detail: 'Assignment ke innerHTML terdeteksi.' },
  { id: '31', ruleId: 'react-dangerous-html', group: 'Injection & Execution', tier: 'FREE', severity: 'Medium', title: 'React dangerouslySetInnerHTML Usage', detail: 'Prop dangerouslySetInnerHTML digunakan.' },
  { id: '32', ruleId: 'node-shell-option', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Node.js Shell Option Enabled', detail: 'Opsi shell: true terlihat aktif.' },
  { id: '33', ruleId: 'python-shell-command', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Python Subprocess with Shell Enabled', detail: 'Pemanggilan subprocess Python terlihat memakai shell=True.' },
  { id: '34', ruleId: 'php-request-command', group: 'Injection & Execution', tier: 'PRO', severity: 'Critical', title: 'PHP Command Execution from Request Input', detail: 'Fungsi eksekusi OS PHP terlihat menerima input request.' },
  { id: '35', ruleId: 'unvalidated-open-redirect', group: 'Input & Request Safety', tier: 'PRO', severity: 'Medium', title: 'Dynamic Redirect from Request Input', detail: 'Redirect HTTP terlihat memakai input request secara langsung.' },
  { id: '36', ruleId: 'dynamic-server-side-request', group: 'Input & Request Safety', tier: 'PRO', severity: 'High', title: 'Server-side Request from User Input', detail: 'HTTP client backend terlihat menerima URL langsung dari request.' },
  { id: '37', ruleId: 'credentials-in-logs', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Sensitive Credential Logged', detail: 'Logger terlihat menerima field password, token, atau authorization.' },
  { id: '38', ruleId: 'jwt-without-expiration', group: 'Auth & Session', tier: 'PRO', severity: 'Medium', title: 'JWT Signing Requires Expiration Review', detail: 'Pemanggilan jwt.sign() satu baris tidak terlihat menyertakan expiresIn.' },
  { id: '39', ruleId: 'jwt-decode-without-verify', group: 'Auth & Session', tier: 'FREE', severity: 'High', title: 'JWT Decoded Without Signature Verification', detail: 'Pemanggilan jwt.decode() terdeteksi.' },
  { id: '40', ruleId: 'weak-session-secret', group: 'Auth & Session', tier: 'PRO', severity: 'High', title: 'Weak Literal Session Secret', detail: 'Session secret terlihat berupa literal string pendek.' },
  { id: '41', ruleId: 'cookie-samesite-disabled', group: 'Auth & Session', tier: 'PRO', severity: 'Medium', title: 'Cookie SameSite Protection Disabled', detail: 'Cookie terlihat memakai sameSite: false.' },
  { id: '42', ruleId: 'cors-wildcard-credentials', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'CORS Wildcard with Credentials Review', detail: 'Konfigurasi CORS satu baris terlihat menggabungkan wildcard origin dan credentials.' },
  { id: '43', ruleId: 'permissive-csp-inline-script', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Permissive CSP unsafe-inline Script', detail: 'Kebijakan CSP terlihat mengizinkan unsafe-inline.' },
  { id: '44', ruleId: 'csrf-disabled', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'CSRF Protection Explicitly Disabled', detail: 'Flag proteksi CSRF terlihat dimatikan secara eksplisit.' },
  { id: '45', ruleId: 'hardcoded-http-url', group: 'Cryptography', tier: 'PRO', severity: 'Low', title: 'Hardcoded Plain HTTP Service URL', detail: 'URL HTTP non-localhost terlihat ditulis di source code.' },
  { id: '46', ruleId: 'predictable-security-token', group: 'Cryptography', tier: 'PRO', severity: 'Medium', title: 'Predictable Random Value for Security Token', detail: 'Math.random() terlihat digunakan pada konteks token, nonce, OTP, atau secret.' },
  { id: '47', ruleId: 'xxe-parser-enabled', group: 'Input & Request Safety', tier: 'PRO', severity: 'High', title: 'XML External Entity Resolution Enabled', detail: 'Parser XML terlihat mengaktifkan entity atau DTD eksternal.' },
  { id: '48', ruleId: 'unrestricted-file-upload', group: 'Input & Request Safety', tier: 'PRO', severity: 'Medium', title: 'Unrestricted File Upload Handler', detail: 'Handler Multer .any() terdeteksi.' },
  { id: '49', ruleId: 'docker-privileged-mode', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Docker Privileged Mode Enabled', detail: 'Konfigurasi container terlihat mengaktifkan privileged mode.' },
  { id: '50', ruleId: 'world-writable-permission', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'World-writable File Permission', detail: 'Perintah chmod 777 terdeteksi.' },
  { id: '51', ruleId: 'aws-access-key-id', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'AWS Access Key ID Pattern', detail: 'Pola AWS Access Key ID (AKIA/ASIA) terlihat di source code.' },
  { id: '52', ruleId: 'aws-secret-access-key', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'AWS Secret Access Key Assignment', detail: 'Variabel AWS secret access key terlihat berisi nilai base64 panjang.' },
  { id: '53', ruleId: 'twilio-credential', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Twilio Account SID or Auth Token', detail: 'Pola Account SID atau auth token Twilio terlihat di repository.' },
  { id: '54', ruleId: 'sendgrid-api-key', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'SendGrid API Key Pattern', detail: 'Pola API key SendGrid terlihat di file repository.' },
  { id: '55', ruleId: 'firebase-private-key', group: 'Secrets & Credentials', tier: 'FREE', severity: 'Critical', title: 'Firebase Service Account Key in Source', detail: 'Field private_key service account Firebase/GCP terlihat di file.' },
  { id: '56', ruleId: 'committed-pkcs12-keystore', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Committed Keystore or Certificate File', detail: 'File keystore atau sertifikat (.p12/.pfx/.jks/.keystore) ditemukan di repository.' },
  { id: '57', ruleId: 'committed-database-dump', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Committed Database Dump File', detail: 'File dump database (.sql/.dump/.sqlite) ditemukan di repository.' },
  { id: '58', ruleId: 'committed-history-secrets', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Committed Shell History File', detail: 'File history shell (.bash_history/.zsh_history) ditemukan di repository.' },
  { id: '59', ruleId: 'basic-auth-in-url', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Embedded Basic Auth Credentials in URL', detail: 'URL terlihat memuat username dan password inline (user:pass@host).' },
  { id: '60', ruleId: 'authorization-bearer-literal', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Hardcoded Authorization Bearer Token', detail: 'Header Authorization Bearer terlihat berisi token literal panjang.' },
  { id: '61', ruleId: 'php-eval-request', group: 'Injection & Execution', tier: 'PRO', severity: 'Critical', title: 'PHP eval on Request Input', detail: 'Fungsi eval() PHP terlihat menerima input request.' },
  { id: '62', ruleId: 'new-function-constructor', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Dynamic Function Constructor', detail: 'Pemanggilan new Function(...) terdeteksi.' },
  { id: '63', ruleId: 'document-write-usage', group: 'Injection & Execution', tier: 'PRO', severity: 'Medium', title: 'document.write Usage', detail: 'Pemanggilan document.write(...) terdeteksi.' },
  { id: '64', ruleId: 'ldap-query-concatenation', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'LDAP Filter Built via Concatenation', detail: 'Filter LDAP terlihat dibangun dengan concatenation string.' },
  { id: '65', ruleId: 'template-engine-autoescape-off', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Template Engine Autoescape Disabled', detail: 'Konfigurasi template engine terlihat menonaktifkan autoescape.' },
  { id: '66', ruleId: 'mongoose-find-request-body', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'NoSQL Query from Unsanitized Request Body', detail: 'Query Mongoose/Mongo terlihat memakai req.body langsung sebagai filter.' },
  { id: '67', ruleId: 'go-sql-fmt-sprintf', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Go SQL Query Built with fmt.Sprintf', detail: 'Query SQL Go terlihat dibangun dengan fmt.Sprintf.' },
  { id: '68', ruleId: 'java-runtime-exec', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Java Runtime.exec Dynamic Command', detail: 'Pemanggilan Runtime.getRuntime().exec(...) terdeteksi.' },
  { id: '69', ruleId: 'ruby-system-interpolation', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Ruby System Call with Interpolation', detail: 'Pemanggilan system/exec Ruby terlihat memuat interpolasi #{...}.' },
  { id: '70', ruleId: 'python-os-system', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Python os.system Usage', detail: 'Pemanggilan os.system(...) terdeteksi.' },
  { id: '71', ruleId: 'zip-extract-no-validation', group: 'Input & Request Safety', tier: 'PRO', severity: 'High', title: 'Archive Extraction Without Path Validation', detail: 'Ekstraksi arsip (extractAll/extractall) terlihat tanpa validasi path.' },
  { id: '72', ruleId: 'prototype-pollution-merge', group: 'Injection & Execution', tier: 'PRO', severity: 'Medium', title: 'Recursive Merge Prototype Pollution Risk', detail: 'Akses __proto__ atau constructor.prototype terlihat di logika merge.' },
  { id: '73', ruleId: 'mass-assignment-spread-body', group: 'Input & Request Safety', tier: 'PRO', severity: 'Medium', title: 'Mass Assignment via Request Body Spread', detail: 'Pembuatan/update record terlihat menyebar ...req.body langsung.' },
  { id: '74', ruleId: 'open-cors-express-all', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Express CORS Reflecting All Origins', detail: 'Header CORS terlihat memantulkan origin request secara dinamis tanpa allowlist.' },
  { id: '75', ruleId: 'helmet-disabled', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Security Header Middleware Disabled', detail: 'Middleware header keamanan (Helmet) terlihat dinonaktifkan.' },
  { id: '76', ruleId: 'dockerfile-root-user', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Dockerfile Runs as Root', detail: 'Dockerfile terlihat menetapkan USER root secara eksplisit.' },
  { id: '77', ruleId: 'k8s-host-network', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Kubernetes hostNetwork Enabled', detail: 'Manifest Kubernetes terlihat mengaktifkan hostNetwork: true.' },
  { id: '78', ruleId: 'k8s-allow-privilege-escalation', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Kubernetes allowPrivilegeEscalation Enabled', detail: 'Security context terlihat mengizinkan privilege escalation.' },
  { id: '79', ruleId: 'terraform-public-s3', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Terraform S3 ACL Public Read', detail: 'Resource Terraform terlihat menetapkan ACL public-read.' },
  { id: '80', ruleId: 'terraform-open-security-group', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Terraform Security Group Open to World', detail: 'Aturan ingress Terraform terlihat mengizinkan 0.0.0.0/0.' },
  { id: '81', ruleId: 'github-actions-pull-request-target', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'GitHub Actions pull_request_target Usage', detail: 'Workflow terlihat memakai trigger pull_request_target.' },
  { id: '82', ruleId: 'ci-curl-pipe-shell', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Pipe Remote Script Directly to Shell', detail: 'Perintah terlihat menyalurkan curl/wget langsung ke shell.' },
  { id: '83', ruleId: 'weak-cipher-des-rc4', group: 'Cryptography', tier: 'PRO', severity: 'High', title: 'Weak Cipher Algorithm (DES/RC4)', detail: 'Algoritme cipher lemah seperti DES atau RC4 terlihat digunakan.' },
  { id: '84', ruleId: 'ecb-mode-cipher', group: 'Cryptography', tier: 'PRO', severity: 'High', title: 'ECB Cipher Mode Usage', detail: 'Mode cipher ECB terlihat digunakan.' },
  { id: '85', ruleId: 'md5-general-hash', group: 'Cryptography', tier: 'PRO', severity: 'Medium', title: 'MD5 Hash Algorithm Usage', detail: 'Pemanggilan hash MD5 terdeteksi.' },
  { id: '86', ruleId: 'jwt-alg-none', group: 'Cryptography', tier: 'PRO', severity: 'High', title: 'JWT Algorithm none Accepted', detail: 'Konfigurasi JWT terlihat mengizinkan algoritme none.' },
  { id: '87', ruleId: 'hardcoded-encryption-key', group: 'Cryptography', tier: 'PRO', severity: 'High', title: 'Hardcoded Encryption Key Literal', detail: 'Variabel encryption key terlihat berisi literal panjang.' },
  { id: '88', ruleId: 'logout-no-session-destroy', group: 'Auth & Session', tier: 'PRO', severity: 'Low', title: 'Cookie Without Expiry or MaxAge Review', detail: 'Cookie sesi terlihat memakai maxAge yang sangat panjang.' },
  { id: '89', ruleId: 'timing-unsafe-token-compare', group: 'Auth & Session', tier: 'PRO', severity: 'Medium', title: 'Non-constant-time Token Comparison', detail: 'Perbandingan token/secret terlihat memakai === biasa.' },
  { id: '90', ruleId: 'verbose-error-stack-response', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Medium', title: 'Stack Trace Returned in HTTP Response', detail: 'Response terlihat mengirim error.stack ke klien.' },
  { id: '91', ruleId: 'insecure-deserialization-java', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Java ObjectInputStream Deserialization', detail: 'Penggunaan ObjectInputStream/readObject terdeteksi.' },
  { id: '92', ruleId: 'wide-open-firebase-rules', group: 'Configuration & Exposure', tier: 'PRO', severity: 'High', title: 'Firebase Rules Allow Public Read/Write', detail: 'Aturan Firebase terlihat mengizinkan read/write tanpa kondisi.' },
  { id: '93', ruleId: 'insecure-postmessage-origin', group: 'Input & Request Safety', tier: 'PRO', severity: 'Medium', title: 'postMessage Without Target Origin', detail: 'postMessage terlihat memakai target origin wildcard *.' },
  { id: '94', ruleId: 'sequelize-raw-replacements-off', group: 'Injection & Execution', tier: 'PRO', severity: 'High', title: 'Sequelize Raw Query with Interpolation', detail: 'Pemanggilan sequelize.query terlihat memuat interpolasi template.' },
  { id: '95', ruleId: 'php-include-request', group: 'Injection & Execution', tier: 'PRO', severity: 'Critical', title: 'PHP Dynamic File Inclusion from Request', detail: 'include/require PHP terlihat menerima input request.' },
  { id: '96', ruleId: 'env-debug-true', group: 'Configuration & Exposure', tier: 'PRO', severity: 'Low', title: 'Debug Flag Enabled in Env File', detail: 'Variabel environment debug terlihat bernilai aktif.' },
  { id: '97', ruleId: 'committed-terraform-state', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Committed Terraform State File', detail: 'File terraform.tfstate ditemukan di repository.' },
  { id: '98', ruleId: 'committed-docker-config-json', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Committed Docker Registry Auth File', detail: 'File .docker/config.json dengan auth registry ditemukan.' },
  { id: '99', ruleId: 'committed-kubeconfig', group: 'Secrets & Credentials', tier: 'PRO', severity: 'Critical', title: 'Committed Kubernetes kubeconfig', detail: 'File kubeconfig ditemukan di repository.' },
  { id: '100', ruleId: 'committed-pem-cert-key-pair', group: 'Secrets & Credentials', tier: 'PRO', severity: 'High', title: 'Committed htpasswd Credentials File', detail: 'File .htpasswd ditemukan di repository.' },
];

/**
 * Display order + descriptions for the rule groups shown in the selector.
 */
export const repositoryScanGroups = [
  { key: 'Secrets & Credentials', label: 'Secrets & Credentials', detail: 'Token, API key, password, dan file kredensial yang bocor di repository.' },
  { key: 'Injection & Execution', label: 'Injection & Execution', detail: 'SQL/NoSQL/command injection, eval, deserialisasi, dan XSS sink.' },
  { key: 'Input & Request Safety', label: 'Input & Request Safety', detail: 'Path traversal, SSRF, open redirect, upload, dan validasi input.' },
  { key: 'Auth & Session', label: 'Auth & Session', detail: 'JWT, cookie, session secret, dan perlindungan otentikasi.' },
  { key: 'Cryptography', label: 'Cryptography', detail: 'Cipher lemah, hashing, TLS, key, dan random yang tidak aman.' },
  { key: 'Configuration & Exposure', label: 'Configuration & Exposure', detail: 'CORS, CSP, Docker/K8s/Terraform, debug, dan file yang terekspos.' },
];

/**
 * Default checks pre-selected for FREE plan users (exactly 5 essentials).
 */
export const defaultFreeSelection = [
  'dynamic-eval',
  'sql-injection-concatenation',
  'hardcoded-api-credential',
  'committed-env-file',
  'github-access-token',
];

export const FREE_RULE_TOTAL = repositoryScanCatalog.filter((rule) => rule.tier === 'FREE').length;
export const PRO_RULE_TOTAL = repositoryScanCatalog.filter((rule) => rule.tier === 'PRO').length;

/**
 * Compact category summary (derived from the rule groups) for marketing pages.
 */
export const scanCategorySummary = repositoryScanGroups.map((group) => ({
  title: group.label,
  detail: group.detail,
}));

export const passiveWebScanCatalog = [
  { id: '01', group: 'Safety', title: 'SSRF destination guard', detail: 'Memblokir localhost, IP privat, dan metadata host.' },
  { id: '02', group: 'Transport', title: 'HTTP protocol review', detail: 'Meninjau penggunaan transport tanpa TLS.' },
  { id: '03', group: 'Transport', title: 'Main response fetch', detail: 'Mengambil response utama dengan batas ukuran dan timeout.' },
  { id: '04', group: 'Headers', title: 'HSTS header', detail: 'Memeriksa Strict-Transport-Security.' },
  { id: '05', group: 'Headers', title: 'CSP header', detail: 'Memeriksa Content-Security-Policy.' },
  { id: '06', group: 'Headers', title: 'Frame protection', detail: 'Memeriksa X-Frame-Options.' },
  { id: '07', group: 'Headers', title: 'MIME sniffing protection', detail: 'Memeriksa X-Content-Type-Options.' },
  { id: '08', group: 'Session', title: 'Cookie HttpOnly', detail: 'Meninjau flag HttpOnly pada cookie sesi.' },
  { id: '09', group: 'Session', title: 'Cookie Secure', detail: 'Meninjau flag Secure pada cookie sesi.' },
  { id: '10', group: 'Headers', title: 'CORS wildcard response', detail: 'Memeriksa origin wildcard pada response.' },
  { id: '11', group: 'Exposure', title: 'Exposed .env file', detail: 'GET terbatas untuk path konfigurasi environment.' },
  { id: '12', group: 'Exposure', title: 'Exposed Git config', detail: 'GET terbatas untuk konfigurasi repository.' },
  { id: '13', group: 'Exposure', title: 'Exposed PHP diagnostics', detail: 'GET terbatas untuk halaman phpinfo.' },
  { id: '14', group: 'Exposure', title: 'WordPress backup config', detail: 'GET terbatas untuk backup konfigurasi WordPress.' },
  { id: '15', group: 'Exposure', title: 'Legacy config backup', detail: 'GET terbatas untuk file konfigurasi lama.' },
  { id: '16', group: 'Exposure', title: 'Administrative portal', detail: 'GET terbatas untuk portal admin publik.' },
  { id: '17', group: 'Exposure', title: 'Swagger documentation', detail: 'GET terbatas untuk dokumentasi API publik.' },
  { id: '18', group: 'Exposure', title: 'Debug portal', detail: 'GET terbatas untuk portal diagnostik.' },
  { id: '19', group: 'Exposure', title: 'Backup ZIP archive', detail: 'GET terbatas untuk backup source code publik.' },
  { id: '20', group: 'Exposure', title: 'SFTP editor config', detail: 'GET terbatas untuk konfigurasi koneksi editor.' },
];

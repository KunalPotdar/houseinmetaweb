House in Meta — static site scaffold

Structure created:
- index.html (root homepage)
- pages/about.html
- pages/projects.html
- pages/blog/index.html
- contact.html
- 404.html
- assets/css/style.css
- assets/js/main.js

How to preview locally (PowerShell):

# Start a local static server using Python 3 (if installed)
python -m http.server 8000
# Then open http://localhost:8000 in your browser

# Or using PowerShell's built-in web server via .NET (PowerShell 5+):
Add-Type -AssemblyName System.Net.HttpListener; $listener = [System.Net.HttpListener]::new(); $listener.Prefixes.Add('http://+:8000/'); $listener.Start(); Write-Host 'Serving at http://localhost:8000' ; while ($listener.IsListening) { $context=$listener.GetContext(); $request=$context.Request; $path = $request.RawUrl.TrimStart('/'); if($path -eq ''){ $path='index.html' }; $file = Join-Path (Get-Location) $path; if(Test-Path $file) { $bytes=[System.IO.File]::ReadAllBytes($file); $context.Response.OutputStream.Write($bytes,0,$bytes.Length) } else { $context.Response.StatusCode=404; $context.Response.Close() } }

Notes:
- All pages use relative paths from the site root. If you plan to serve from a subpath, adjust the asset links.
- Consider adding metadata, favicon, and a markdown pipeline for blog posts.

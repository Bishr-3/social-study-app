import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "فخورون بالإمارات 🇦🇪 | المدرسة الأهلية الخيرية",
  description:
    "فعالية فخورون بالإمارات - التعبير عن حب الوطن والانتماء إليه وإبراز إنجازات دولة الإمارات العربية المتحدة",
  keywords: "الإمارات, فخورون, وطني, المدرسة الأهلية الخيرية, سمنان",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6089432800736094"
          crossOrigin="anonymous"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Security measures to prevent tampering
              (function() {
                // Prevent right-click context menu
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                });

                // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
                document.addEventListener('keydown', function(e) {
                  if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                    (e.ctrlKey && e.key === 'U')
                  ) {
                    e.preventDefault();
                    return false;
                  }
                });

                // Detect dev tools and blur the page
                let devtools = {open: false, orientation: null};
                const threshold = 160;
                setInterval(() => {
                  if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                      devtools.open = true;
                      document.body.style.filter = 'blur(10px)';
                      document.body.style.pointerEvents = 'none';
                      alert('تم اكتشاف أدوات المطور. الصفحة محمية.');
                    }
                  } else {
                    devtools.open = false;
                    document.body.style.filter = '';
                    document.body.style.pointerEvents = '';
                  }
                }, 500);

                // Prevent console manipulation
                const _log = console.log;
                const _error = console.error;
                console.log = function() {
                  // Allow only specific logs
                  if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('فخورون بالإمارات')) {
                    _log.apply(console, arguments);
                  }
                };
                console.error = function() {
                  if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('فخورون بالإمارات')) {
                    _error.apply(console, arguments);
                  }
                };

                // Prevent paste in console-like inputs
                document.addEventListener('paste', function(e) {
                  const target = e.target;
                  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                    // Allow paste in legitimate inputs, but log suspicious activity
                    console.log('فخورون بالإمارات: تم اكتشاف لصق في حقل إدخال');
                  }
                });

                // Monitor for suspicious scripts
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName) {
                  const element = originalCreateElement.call(this, tagName);
                  if (tagName === 'script') {
                    console.log('فخورون بالإمارات: تم إنشاء عنصر script');
                  }
                  return element;
                };

                // Monitor DOM changes on like elements
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                      const target = mutation.target;
                      if (target.classList && (target.classList.contains('likes') || target.textContent && target.textContent.match(/\\d+/))) {
                        // Re-validate likes from server
                        console.log('تم اكتشاف تعديل على عدد الإعجابات. سيتم التحقق من السيرفر.');
                        // Trigger re-fetch (this would need to be implemented per component)
                      }
                    }
                  });
                });

                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  characterData: true
                });

                // Prevent eval and other dangerous functions
                window.eval = function() { throw new Error('eval is disabled for security'); };
                window.Function = function() { throw new Error('Function constructor is disabled'); };
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

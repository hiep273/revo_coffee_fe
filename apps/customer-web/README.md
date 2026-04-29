# Revo Coffee (React + Vite)

Mô tả ngắn
-------------
Đây là phiên bản React + Vite cho website Revo Coffee — một giao diện cửa hàng bán cà phê mẫu. Mục tiêu của README này là hướng dẫn nhanh cách chạy, build và cấu trúc dự án để dễ tiếp cận và phát triển.

Yêu cầu
-------
- Node.js 18+ hoặc tương đương
- npm hoặc pnpm/yarn

Cài đặt & chạy (development)
-----------------------------
1. Cài dependencies:

	 `npm install`

2. Chạy server dev (Vite, HMR):

	 `npm run dev`

3. Mở trình duyệt tại đường dẫn được in ra (mặc định `http://localhost:5173`).

Build & preview
----------------
- Tạo bản build production:

	`npm run build`

- Xem thử bản build cục bộ:

	`npm run preview`

Cấu trúc chính của dự án
-------------------------
- `index.html` — entry HTML
- `src/` — mã nguồn React
	- `main.jsx` — điểm khởi chạy app
	- `App.jsx` — component gốc
	- `components/` — các component giao diện (Header, Footer, Products...)
	- `pages/` — các trang (Home, Shop, Cart, Checkout, admin/...)
	- `store/useStore.js` — trạng thái ứng dụng (store)
- `public/` — tài nguyên tĩnh (hình ảnh, favicon...)

Các tính năng nổi bật
---------------------
- Giao diện cửa hàng mẫu (Home, Shop, Product detail, Cart, Checkout)
- Quản trị cơ bản trong `pages/admin`

Linting / Tools
---------------
- ESLint cấu hình sẵn (xem `eslint.config.js`)
- Vite làm dev server và build tool

Góp phần & phát triển
---------------------
- Muốn đóng góp: tạo issue hoặc pull request trên repo
- Khi làm việc trên feature mới: tạo branch riêng, viết commit rõ ràng và kèm mô tả

Tài liệu tham khảo
------------------
- Vite: https://vite.dev
- React: https://react.dev


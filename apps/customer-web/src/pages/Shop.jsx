
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api/products';
const PAGE_SIZE = 9;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [appliedSearchMinPrice, setAppliedSearchMinPrice] = useState('');
  const [appliedSearchMaxPrice, setAppliedSearchMaxPrice] = useState('');
  const [appliedFilterType, setAppliedFilterType] = useState('all');
  const [appliedRegions, setAppliedRegions] = useState([]);
  const [activeFilterGroup, setActiveFilterGroup] = useState('none');
  const [appliedFilterGroup, setAppliedFilterGroup] = useState('none');

  const [openSections, setOpenSections] = useState({
    variety: true,
    region: false,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    const normalizedSearch = searchTerm.trim();

    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));

    if (normalizedSearch) {
      params.set('search', normalizedSearch);
    }
    if (appliedSearchMinPrice !== '') {
      params.set('searchMinPrice', appliedSearchMinPrice);
    }
    if (appliedSearchMaxPrice !== '') {
      params.set('searchMaxPrice', appliedSearchMaxPrice);
    }

    params.set('filterGroup', appliedFilterGroup);
    if (appliedFilterGroup === 'price') {
      if (appliedMinPrice !== '') {
        params.set('minPrice', appliedMinPrice);
      }
      if (appliedMaxPrice !== '') {
        params.set('maxPrice', appliedMaxPrice);
      }
    }
    if (appliedFilterGroup === 'type' && appliedFilterType !== 'all') {
      params.set('type', appliedFilterType);
    }
    if (appliedFilterGroup === 'region' && appliedRegions.length > 0) {
      params.set('regions', appliedRegions.join(','));
    }

    const controller = new AbortController();
    const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items || [];
        setProducts(items);
        setTotalProducts(data.total ?? items.length);
        setTotalPages(data.totalPages ?? 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Lỗi tải sản phẩm:', err);
        setLoading(false);
      });
    return () => controller.abort();
  }, [
    searchTerm,
    appliedSearchMinPrice,
    appliedSearchMaxPrice,
    page,
    appliedFilterGroup,
    appliedMinPrice,
    appliedMaxPrice,
    appliedFilterType,
    appliedRegions,
  ]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleRegion = (region) => {
    setActiveFilterGroup('region');
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const applySearch = () => {
    setAppliedSearchMinPrice(minPrice);
    setAppliedSearchMaxPrice(maxPrice);
    setPage(1);
  };

  const applyFilters = () => {
    const hasPriceFilter = minPrice !== '' || maxPrice !== '';
    const hasTypeFilter = filterType !== 'all';
    const hasRegionFilter = selectedRegions.length > 0;
    const nextFilterGroup =
      activeFilterGroup !== 'none'
        ? activeFilterGroup
        : hasPriceFilter
          ? 'price'
          : hasTypeFilter
            ? 'type'
            : hasRegionFilter
              ? 'region'
              : 'none';

    setAppliedFilterGroup(nextFilterGroup);
    setAppliedMinPrice(nextFilterGroup === 'price' ? minPrice : '');
    setAppliedMaxPrice(nextFilterGroup === 'price' ? maxPrice : '');
    setAppliedFilterType(nextFilterGroup === 'type' ? filterType : 'all');
    setAppliedRegions(nextFilterGroup === 'region' ? selectedRegions : []);
    setPage(1);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilterType('all');
    setSelectedRegions([]);

    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setAppliedSearchMinPrice('');
    setAppliedSearchMaxPrice('');
    setAppliedFilterType('all');
    setAppliedRegions([]);
    setActiveFilterGroup('none');
    setAppliedFilterGroup('none');
    setPage(1);
  };

  return (
    <div className="bg-pinky-gray min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {loading ? (
          <div className="text-center py-20 font-nunito text-primary text-xl">
            Đang tải sản phẩm...
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="w-full md:w-72 flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 text-center">
                  <h2 className="font-montserrat font-bold text-xl text-primary uppercase tracking-[0.15em]">
                    Bộ Lọc
                  </h2>
                </div>

                <div className="p-5 space-y-6">
                  {/* Search */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            applySearch();
                          }
                        }}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-nunito text-primary focus:outline-none focus:ring-2 focus:ring-accent-1/40"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        🔍
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={applySearch}
                      className="mt-3 w-full bg-accent-1 text-white font-nunito font-bold py-2.5 rounded-full hover:bg-primary transition-colors uppercase tracking-widest text-xs"
                    >
                      Tìm kiếm
                    </button>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider text-primary mb-4">
                      Khoảng giá
                    </h3>

                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setActiveFilterGroup('price');
                        }}
                        placeholder="Từ"
                        className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-accent-1/40"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setActiveFilterGroup('price');
                        }}
                        placeholder="Đến"
                        className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm font-nunito focus:outline-none focus:ring-2 focus:ring-accent-1/40"
                      />
                    </div>
                  </div>

                  {/* Coffee Type */}
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleSection('variety')}
                      className="w-full flex items-center justify-between py-2 group"
                    >
                      <span className="font-montserrat font-bold text-sm uppercase tracking-wider text-primary group-hover:text-accent-1 transition-colors">
                        Giống cà phê
                      </span>
                      <span
                        className={`transition-transform ${
                          openSections.variety ? 'rotate-180' : ''
                        }`}
                      >
                        ⌄
                      </span>
                    </button>

                    {openSections.variety && (
                      <div className="mt-2 space-y-2 font-nunito text-primary/80">
                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="radio"
                            name="type"
                            checked={filterType === 'all'}
                            onChange={() => {
                              setFilterType('all');
                              setActiveFilterGroup('none');
                            }}
                            className="accent-accent-1"
                          />
                          <span>Tất cả</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="radio"
                            name="type"
                            checked={filterType === 'arabica'}
                            onChange={() => {
                              setFilterType('arabica');
                              setActiveFilterGroup('type');
                            }}
                            className="accent-accent-1"
                          />
                          <span>Arabica</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="radio"
                            name="type"
                            checked={filterType === 'robusta'}
                            onChange={() => {
                              setFilterType('robusta');
                              setActiveFilterGroup('type');
                            }}
                            className="accent-accent-1"
                          />
                          <span>Robusta</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="radio"
                            name="type"
                            checked={filterType === 'fine-robusta'}
                            onChange={() => {
                              setFilterType('fine-robusta');
                              setActiveFilterGroup('type');
                            }}
                            className="accent-accent-1"
                          />
                          <span>Fine Robusta</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Region */}
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => toggleSection('region')}
                      className="w-full flex items-center justify-between py-2 group"
                    >
                      <span className="font-montserrat font-bold text-sm uppercase tracking-wider text-primary group-hover:text-accent-1 transition-colors">
                        Vùng trồng
                      </span>
                      <span
                        className={`transition-transform ${
                          openSections.region ? 'rotate-180' : ''
                        }`}
                      >
                        ⌄
                      </span>
                    </button>

                    {openSections.region && (
                      <div className="mt-2 space-y-2 font-nunito text-primary/80">
                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes('dalat')}
                            onChange={() => toggleRegion('dalat')}
                            className="accent-accent-1"
                          />
                          <span>Đà Lạt</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes('daklak')}
                            onChange={() => toggleRegion('daklak')}
                            className="accent-accent-1"
                          />
                          <span>Đắk Lắk</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes('gialai')}
                            onChange={() => toggleRegion('gialai')}
                            className="accent-accent-1"
                          />
                          <span>Gia Lai</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes('sonla')}
                            onChange={() => toggleRegion('sonla')}
                            className="accent-accent-1"
                          />
                          <span>Sơn La</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="w-full bg-primary text-white font-nunito font-bold py-3 rounded-full hover:bg-accent-1 transition-colors shadow-md uppercase tracking-widest text-xs"
                    >
                      Áp Dụng Lọc
                    </button>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full text-accent-1 font-nunito font-bold text-sm hover:underline"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <section className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 border-b border-gray-200 pb-4 gap-3">
                <h1 className="font-montserrat font-black text-4xl text-primary uppercase tracking-tight">
                  Cửa Hàng
                </h1>
                <span className="font-nunito text-primary/60 italic">
                  Hiển thị {totalProducts} sản phẩm
                </span>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl p-6 flex flex-col hover:shadow-lg transition-all group"
                    >
                      <div className="flex justify-center mb-4 h-48 relative overflow-hidden">
                        <img
                          src={
                            product.image ||
                            'https://via.placeholder.com/400x400?text=Coffee'
                          }
                          alt={product.name || 'Sản phẩm cà phê'}
                          className="h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="mt-auto">
                        <span className="text-xs font-nunito tracking-widest text-accent-1 uppercase font-bold mb-1 block">
                          {(product.type || 'Chưa cập nhật').replace('-', ' ')}
                        </span>

                        <h3 className="font-montserrat font-bold text-xl text-primary mb-2 line-clamp-1">
                          {product.name || 'Tên sản phẩm'}
                        </h3>

                        <div className="flex items-center justify-between mt-4 gap-3">
                          <span className="font-montserrat font-bold text-lg text-primary">
                            {Number(product.price || 0).toLocaleString(
                              'vi-VN'
                            )}
                            đ
                          </span>

                          <Link
                            to={`/product/${product.id}`}
                            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-nunito font-bold hover:bg-accent-1 transition-colors whitespace-nowrap"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="bg-gray-100 p-6 rounded-full mb-6 text-4xl">
                    🔍
                  </div>
                  <p className="font-nunito text-lg text-primary/60 text-center">
                    Không tìm thấy sản phẩm phù hợp.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-accent-1 hover:underline text-sm font-bold uppercase tracking-wider"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

              {totalProducts > PAGE_SIZE && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                  <span className="font-nunito text-sm text-primary/60">
                    Trang {page} / {totalPages}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-full border border-gray-200 bg-white font-nunito font-bold text-sm text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-1 hover:text-accent-1 transition-colors"
                    >
                      Trước
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={page >= totalPages}
                      className="px-4 py-2 rounded-full border border-gray-200 bg-white font-nunito font-bold text-sm text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-1 hover:text-accent-1 transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

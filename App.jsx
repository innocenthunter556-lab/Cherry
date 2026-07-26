import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Menu, X, ArrowRight, ArrowLeft, MessageCircle, Phone, MapPin, Clock,
  Instagram, Facebook, Mail, Star, Crown, Shirt, Sparkles, Gem,
  Layers, ShoppingBag, ShoppingCart, Users, Scissors, RefreshCw, RotateCw,
  Palette, Zap, Ruler, Check, Camera, Heart, Package,
} from 'lucide-react';

const CHARCOAL_DEEP = '#17130F';
const CHARCOAL = '#241E17';
const IVORY = '#F6F1E7';
const PEARL = '#FBF9F4';
const GOLD_ROYAL = '#A9812A';
const CHAMPAGNE = '#E8D9B0';
const ROSE_GOLD = '#C79A82';

const WHATSAPP_NUM = '917396009883';
const PHONE_DISPLAY = '+91 73960 09883';
const ADDRESS = '8GQP+RHG, Durga Nagar, Kharmanghat, Telangana 500079';
const LAT = 17.3392658;
const LNG = 78.5366397;
const INSTAGRAM_URL = 'https://www.instagram.com/srisaiboutique.in/';
const EMAIL = 'chpavani5607@gmail.com';
const MAPS_SHARE_URL = 'https://maps.app.goo.gl/trjh59fhceaKR3a96?g_st=ac';

function waLink(msg) {
  return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
}

function formatINR(num) {
  return '\u20B9' + num.toLocaleString('en-IN');
}

function getDiscountInfo(price, name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 997;
  const discountPct = 10 + (hash % 16);
  const original = Math.round(price / (1 - discountPct / 100) / 10) * 10;
  return { original, discountPct };
}

function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff2d9, 0.6));
    const key = new THREE.PointLight(0xffd77a, 3.0, 60);
    key.position.set(6, 5, 6);
    scene.add(key);
    const fillLight = new THREE.PointLight(0xffffff, 0.9, 60);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);
    const rim = new THREE.PointLight(0xffcf80, 1.4, 60);
    rim.position.set(0, -4, -5);
    scene.add(rim);

    const group = new THREE.Group();

    const ribbonConfigs = [
      { color: 0xc9a227, y: 0.9, z: -0.6, rotX: 0.25, phase: 0 },
      { color: 0xe8d9b0, y: -0.2, z: 0.4, rotX: -0.15, phase: 2.1 },
      { color: 0xc79a82, y: -1.2, z: -1.1, rotX: 0.35, phase: 4.2 },
    ];

    const ribbons = ribbonConfigs.map((cfg) => {
      const geo = new THREE.PlaneGeometry(7.5, 1.5, 64, 10);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        metalness: 0.5,
        roughness: 0.4,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, cfg.y, cfg.z);
      mesh.rotation.x = cfg.rotX;
      mesh.userData.phase = cfg.phase;
      group.add(mesh);
      return mesh;
    });

    scene.add(group);

    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe8d9b0,
      size: 0.032,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    const handlePointerMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mouseX = (cx / window.innerWidth) * 2 - 1;
      mouseY = (cy / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ribbons.forEach((ribbon) => {
        const posAttr = ribbon.geometry.attributes.position;
        const phase = ribbon.userData.phase;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const wave = Math.sin(x * 0.85 + t * 1.0 + phase) * 0.32 + Math.sin(y * 1.5 + t * 0.5 + phase) * 0.07;
          posAttr.setZ(i, wave);
        }
        posAttr.needsUpdate = true;
        ribbon.geometry.computeVertexNormals();
        ribbon.rotation.z = Math.sin(t * 0.12 + phase) * 0.06;
      });

      group.rotation.y = mouseX * 0.35 + Math.sin(t * 0.08) * 0.08;
      group.rotation.x = mouseY * 0.15;
      particles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

function LoadingScreen({ visible, progress }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{
        backgroundColor: CHARCOAL_DEEP,
        zIndex: 100,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <p className="font-display text-3xl sm:text-4xl tracking-widest mb-6" style={{ color: CHAMPAGNE }}>
        SRI SAI BOUTIQUE
      </p>
      <div className="w-48 h-px relative overflow-hidden" style={{ backgroundColor: 'rgba(232,217,176,0.2)' }}>
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${progress}%`, backgroundColor: GOLD_ROYAL, transition: 'width 0.1s linear' }}
        />
      </div>
      <p className="text-xs tracking-widest mt-4" style={{ color: 'rgba(232,217,176,0.6)' }}>{progress}%</p>
    </div>
  );
}

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)', transition: 'transform 0.4s ease' });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(900px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) scale(1.02)`, transition: 'transform 0.1s ease-out' });
  };

  const handleLeave = () => {
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)', transition: 'transform 0.4s ease' });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ ...style, transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}

function MediaTile({ image, Icon, variant = 0, alt = '' }) {
  if (image) {
    return <img src={image} alt={alt} className="w-full h-full object-cover" loading="lazy" />;
  }
  const tones = [
    { grad: `linear-gradient(150deg, #2A2113, #1A140D)`, accent: CHAMPAGNE },
    { grad: `linear-gradient(150deg, #241B12, #17130F)`, accent: GOLD_ROYAL },
    { grad: `linear-gradient(150deg, #2B1F16, #1C150E)`, accent: ROSE_GOLD },
  ];
  const t = tones[variant % tones.length];
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ background: t.grad }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: `radial-gradient(${t.accent} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
      {Icon && <Icon size={40} style={{ color: t.accent }} strokeWidth={0.85} className="relative" />}
    </div>
  );
}

function CategoryGrid({ categories, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat, i) => (
        <FadeIn key={cat.id} delay={i * 0.05}>
          <button
            onClick={() => onSelect(cat.id)}
            className="relative w-full aspect-square overflow-hidden text-center transition-transform hover:scale-105"
            style={{ border: '1px solid rgba(232,217,176,0.2)' }}
          >
            <MediaTile image={cat.image} Icon={cat.icon} variant={i} alt={cat.label} />
            <div
              className="absolute inset-0 flex flex-col items-center justify-end gap-1 p-4"
              style={{ background: 'linear-gradient(0deg, rgba(23,19,15,0.88) 0%, rgba(23,19,15,0.25) 55%, transparent 100%)' }}
            >
              <span className="text-sm tracking-wide">{cat.label}</span>
              <span className="text-xs text-stone-400">{cat.items.length} Styles</span>
            </div>
          </button>
        </FadeIn>
      ))}
    </div>
  );
}

function ProductCard({ product, categoryLabel, categoryId, Icon, variant, onAddToCart, onOpenProduct, onToggleWishlist, isWishlisted, cartItem }) {
  const qty = cartItem ? cartItem.qty : 0;
  const { original, discountPct } = getDiscountInfo(product.price, product.name);
  return (
    <div>
      <div className="relative">
        <button onClick={() => onOpenProduct(categoryId, product.name)} className="block w-full text-left">
          <div className="aspect-square mb-3 overflow-hidden" style={{ border: '1px solid rgba(169,129,42,0.22)' }}>
            <MediaTile image={product.image} Icon={Icon} variant={variant} alt={product.name} />
          </div>
        </button>
        <span className="absolute top-2 left-2 px-2 py-1 text-xs" style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}>
          {discountPct}% OFF
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product, categoryLabel, categoryId); }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(23,19,15,0.65)' }}
          aria-label="Toggle wishlist"
        >
          <Heart size={15} fill={isWishlisted ? '#e0607a' : 'none'} style={{ color: isWishlisted ? '#e0607a' : '#fff' }} />
        </button>
      </div>
      <button onClick={() => onOpenProduct(categoryId, product.name)} className="block text-left w-full">
        <p className="text-xs tracking-widest text-stone-500 mb-1">{categoryLabel.toUpperCase()}</p>
        <h3 className="font-display text-base mb-1">{product.name}</h3>
      </button>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-sm" style={{ color: CHAMPAGNE }}>{formatINR(product.price)}</p>
        <p className="text-xs text-stone-500 line-through">{formatINR(original)}</p>
      </div>
      <button
        onClick={() => onAddToCart(product, categoryLabel, categoryId)}
        className="w-full py-2.5 text-xs tracking-widest flex items-center justify-center gap-2 transition-colors"
        style={{
          backgroundColor: qty > 0 ? 'rgba(169,129,42,0.15)' : GOLD_ROYAL,
          color: qty > 0 ? CHAMPAGNE : CHARCOAL_DEEP,
          border: qty > 0 ? `1px solid ${GOLD_ROYAL}` : '1px solid transparent',
        }}
      >
        {qty > 0 ? <Check size={14} /> : <ShoppingCart size={14} />}
        {qty > 0 ? `IN CART \u00b7 ${qty}` : 'ADD TO CART'}
      </button>
    </div>
  );
}

function CategoryPage({ category, cart, wishlist, onAddToCart, onOpenProduct, onToggleWishlist, onBack }) {
  if (!category) return null;
  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 min-h-screen" style={{ backgroundColor: CHARCOAL_DEEP }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8 text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Collections
        </button>
        <div className="flex items-center gap-4 mb-3">
          <category.icon size={28} style={{ color: GOLD_ROYAL }} />
          <h1 className="font-display text-3xl sm:text-5xl">{category.label}</h1>
        </div>
        <p className="text-stone-400 text-sm mb-12 font-light">{category.items.length} styles available &middot; prices shown are starting estimates, confirmed after fabric &amp; design consultation</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {category.items.map((item, i) => {
            const id = `${category.id}-${item.name}`;
            const cartItem = cart.find((c) => c.id === id);
            const isWishlisted = wishlist.some((w) => w.id === id);
            return (
              <FadeIn key={item.name} delay={Math.min(i * 0.04, 0.4)}>
                <ProductCard
                  product={item} categoryLabel={category.label} categoryId={category.id} Icon={category.icon} variant={i}
                  onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} onToggleWishlist={onToggleWishlist}
                  isWishlisted={isWishlisted} cartItem={cartItem}
                />
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductPage({ category, product, cart, wishlist, onAddToCart, onToggleWishlist, onOpenProduct, onBack }) {
  const [size, setSize] = useState('36');
  if (!category || !product) return null;
  const id = `${category.id}-${product.name}`;
  const cartItem = cart.find((c) => c.id === id);
  const isWishlisted = wishlist.some((w) => w.id === id);
  const { original, discountPct } = getDiscountInfo(product.price, product.name);
  const sizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44'];
  const related = category.items.filter((it) => it.name !== product.name).slice(0, 4);

  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 min-h-screen" style={{ backgroundColor: CHARCOAL_DEEP }}>
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8 text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to {category.label}
        </button>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 mb-24">
          <TiltCard>
            <div className="aspect-square overflow-hidden" style={{ border: '1px solid rgba(169,129,42,0.25)' }}>
              <MediaTile image={product.image} Icon={category.icon} variant={0} alt={product.name} />
            </div>
          </TiltCard>

          <div>
            <p className="text-xs tracking-widest text-stone-500 mb-2">{category.label.toUpperCase()}</p>
            <h1 className="font-display text-3xl sm:text-4xl mb-4">{product.name}</h1>

            <div className="flex items-center flex-wrap gap-3 mb-1">
              <span className="text-2xl" style={{ color: CHAMPAGNE }}>{formatINR(product.price)}</span>
              <span className="text-base text-stone-500 line-through">{formatINR(original)}</span>
              <span className="text-xs px-2 py-1" style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}>{discountPct}% OFF</span>
            </div>
            <p className="text-xs text-stone-500 mb-6">Starting price &middot; final cost confirmed after fabric &amp; design consultation</p>

            <p className="text-sm text-stone-400 font-light leading-relaxed mb-8">
              A {category.label.toLowerCase()} piece, cut and hand-finished to your measurements at our Kharmanghat atelier. Fabric, colour, and embellishment can be tailored to your occasion.
            </p>

            <p className="text-xs tracking-widest text-stone-400 mb-3">SELECT SIZE (INCHES)</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="w-11 h-11 text-sm transition-colors"
                  style={{
                    border: `1px solid ${size === s ? GOLD_ROYAL : 'rgba(232,217,176,0.3)'}`,
                    backgroundColor: size === s ? GOLD_ROYAL : 'transparent',
                    color: size === s ? CHARCOAL_DEEP : CHAMPAGNE,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500 mb-8">Not sure of your size? Our team will confirm exact measurements before stitching.</p>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => onAddToCart(product, category.label, category.id, size)}
                className="flex-1 py-3.5 text-sm tracking-widest flex items-center justify-center gap-2 transition-colors"
                style={{
                  backgroundColor: cartItem ? 'rgba(169,129,42,0.15)' : GOLD_ROYAL,
                  color: cartItem ? CHAMPAGNE : CHARCOAL_DEEP,
                  border: cartItem ? `1px solid ${GOLD_ROYAL}` : '1px solid transparent',
                }}
              >
                {cartItem ? <Check size={16} /> : <ShoppingCart size={16} />}
                {cartItem ? `IN CART \u00b7 ${cartItem.qty}` : 'ADD TO CART'}
              </button>
              <button
                onClick={() => onToggleWishlist(product, category.label, category.id)}
                className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${isWishlisted ? '#e0607a' : 'rgba(232,217,176,0.3)'}` }}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#e0607a' : 'none'} style={{ color: isWishlisted ? '#e0607a' : CHAMPAGNE }} />
              </button>
            </div>
            <a
              href={waLink(`Hi Sri Sai Boutique, I'd like to customize the ${product.name} \u2014 different fabric, colour, or fit. Can we discuss?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-sm tracking-widest flex items-center justify-center gap-2 border transition-colors hover:border-white"
              style={{ borderColor: 'rgba(232,217,176,0.35)', color: CHAMPAGNE }}
            >
              <Palette size={16} /> REQUEST CUSTOM DESIGN
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl mb-8">More from {category.label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              {related.map((item, i) => {
                const rid = `${category.id}-${item.name}`;
                return (
                  <FadeIn key={item.name} delay={i * 0.05}>
                    <ProductCard
                      product={item} categoryLabel={category.label} categoryId={category.id} Icon={category.icon} variant={i}
                      onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === rid)} cartItem={cart.find((c) => c.id === rid)}
                    />
                  </FadeIn>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, cart, categories, onAddToCart, onOpenProduct, onToggleWishlist, onBack }) {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 min-h-screen" style={{ backgroundColor: CHARCOAL_DEEP }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8 text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1 className="font-display text-3xl sm:text-5xl mb-3">Your Wishlist</h1>
        <p className="text-stone-400 text-sm mb-12 font-light">{wishlist.length} saved {wishlist.length === 1 ? 'piece' : 'pieces'}</p>
        {wishlist.length === 0 ? (
          <p className="text-stone-500 text-sm">Nothing saved yet. Tap the heart icon on any product to add it here.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {wishlist.map((w, i) => {
              const cat = categories.find((c) => c.id === w.categoryId);
              const cartItem = cart.find((c) => c.id === w.id);
              return (
                <FadeIn key={w.id} delay={i * 0.04}>
                  <ProductCard
                    product={w} categoryLabel={w.category} categoryId={w.categoryId} Icon={cat ? cat.icon : Gem} variant={i}
                    onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} onToggleWishlist={onToggleWishlist}
                    isWishlisted={true} cartItem={cartItem}
                  />
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrackOrderPage({ onBack }) {
  const [ref, setRef] = useState('');
  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 min-h-screen" style={{ backgroundColor: CHARCOAL_DEEP }}>
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8 text-stone-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <Package size={30} style={{ color: GOLD_ROYAL }} className="mb-6" />
        <h1 className="font-display text-3xl sm:text-4xl mb-4">Track Your Order</h1>
        <p className="text-stone-400 text-sm font-light leading-relaxed mb-8">
          Every piece here is custom-stitched, so status is confirmed directly by the boutique rather than an automated system. Enter your order reference or the phone number you ordered with, and we'll reply on WhatsApp with an update.
        </p>
        <label className="text-xs tracking-widest text-stone-400 mb-2 block">ORDER REFERENCE OR PHONE NUMBER</label>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. 9876543210"
          className="w-full px-4 py-3 text-sm mb-6 outline-none"
          style={{ backgroundColor: 'rgba(232,217,176,0.06)', border: '1px solid rgba(232,217,176,0.25)', color: IVORY }}
        />
        <a
          href={waLink(ref.trim() ? `Hi Sri Sai Boutique, could you share the status of my order? Reference: ${ref.trim()}` : 'Hi Sri Sai Boutique, could you share the status of my order?')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 text-sm tracking-widest flex items-center justify-center gap-2"
          style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}
        >
          <MessageCircle size={16} /> CHECK STATUS ON WHATSAPP
        </a>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, updateQty, removeFromCart, total }) {
  const checkoutMessage = () => {
    let msg = 'Hi Sri Sai Boutique, I would like to order:\n\n';
    cart.forEach((c) => {
      msg += `- ${c.name} (Size ${c.size || '36'}) x${c.qty} - ${formatINR(c.price * c.qty)}\n`;
    });
    msg += `\nEstimated Total: ${formatINR(total)}\n\nPlease confirm availability and next steps.`;
    return msg;
  };

  return (
    <>
      {open && <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 95 }} onClick={onClose} />}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-96 flex flex-col transition-transform duration-300"
        style={{
          backgroundColor: CHARCOAL,
          zIndex: 96,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(232,217,176,0.15)' }}>
          <h3 className="font-display text-xl" style={{ color: CHAMPAGNE }}>Your Order</h3>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} className="text-stone-300" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <p className="text-stone-500 text-sm mt-8 text-center">Your cart is empty. Browse the collections to add pieces.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 pb-5 border-b" style={{ borderColor: 'rgba(232,217,176,0.1)' }}>
                  <div className="flex-1">
                    <p className="text-xs tracking-widest text-stone-500 mb-1">{item.category.toUpperCase()} &middot; SIZE {item.size || '36'}</p>
                    <p className="text-sm mb-2">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-sm" style={{ border: '1px solid rgba(232,217,176,0.3)', color: CHAMPAGNE }}>-</button>
                      <span className="text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-sm" style={{ border: '1px solid rgba(232,217,176,0.3)', color: CHAMPAGNE }}>+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-2" style={{ color: CHAMPAGNE }}>{formatINR(item.price * item.qty)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-white" aria-label="Remove item">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: 'rgba(232,217,176,0.15)' }}>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-stone-400">Estimated Total</span>
              <span style={{ color: CHAMPAGNE }}>{formatINR(total)}</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">Final pricing confirmed after fabric &amp; fitting consultation.</p>
            <a
              href={waLink(checkoutMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-sm tracking-widest flex items-center justify-center gap-2"
              style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}
            >
              <MessageCircle size={16} /> CHECKOUT ON WHATSAPP
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default function SriSaiBoutique() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [view, setView] = useState('home');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    let raf;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLoaderVisible(false), 250);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loaderVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loaderVisible]);

  const openCategory = (id) => {
    setActiveCategoryId(id);
    setView('category');
    window.scrollTo(0, 0);
  };

  const openProduct = (categoryId, productName) => {
    setActiveCategoryId(categoryId);
    setActiveProduct({ categoryId, productName });
    setView('product');
    window.scrollTo(0, 0);
  };

  const openWishlist = () => {
    setView('wishlist');
    window.scrollTo(0, 0);
  };

  const openTracking = () => {
    setView('tracking');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView('home');
    setActiveCategoryId(null);
    setActiveProduct(null);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (view !== 'home') {
      setView('home');
      setActiveCategoryId(null);
      setActiveProduct(null);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product, categoryLabel, categoryId, size = '36') => {
    const id = `${categoryId}-${product.name}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id, name: product.name, price: product.price, category: categoryLabel, size, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleWishlist = (product, categoryLabel, categoryId) => {
    const id = `${categoryId}-${product.name}`;
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === id);
      if (exists) return prev.filter((w) => w.id !== id);
      return [...prev, { id, name: product.name, price: product.price, category: categoryLabel, categoryId, image: product.image }];
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const navLinks = [
    { label: 'Collections', href: '#collections' },
    { label: 'Services', href: '#services' },
    { label: 'Our Story', href: '#story' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Visit Us', href: '#visit' },
  ];

  const categories = [
    { id: 'bridal', label: 'Bridal Collection', icon: Crown, items: [
      { name: 'Bridal Lehengas', price: 15000 }, { name: 'Bridal Sarees', price: 6000 },
      { name: 'Reception Gowns', price: 9000 }, { name: 'Mehendi Dresses', price: 3500 },
      { name: 'Haldi Dresses', price: 2800 }, { name: 'Sangeet Outfits', price: 4500 },
      { name: 'Engagement Dresses', price: 6500 }, { name: 'Bridal Dupattas', price: 1800 },
    ] },
    { id: 'blouses', label: 'Blouses', icon: Shirt, items: [
      { name: 'Designer Blouses', price: 1200 }, { name: 'Bridal Blouses', price: 2500 },
      { name: 'Maggam Work Blouses', price: 3200 }, { name: 'Ready-made Blouses', price: 800 },
      { name: 'Padded Blouses', price: 1000 }, { name: 'Silk Blouses', price: 1400 },
      { name: 'Boat Neck Blouses', price: 950 }, { name: 'High Neck Blouses', price: 950 },
      { name: 'Princess Cut Blouses', price: 1100 }, { name: 'Sleeveless Blouses', price: 850 },
      { name: 'Full Sleeve Blouses', price: 900 }, { name: 'Custom Stitching', price: 700 },
    ] },
    { id: 'lehengas', label: 'Lehengas', icon: Sparkles, items: [
      { name: 'Party Wear Lehengas', price: 5500 }, { name: 'Designer Lehengas', price: 8500 },
      { name: 'Kids Lehengas', price: 2500 }, { name: 'Crop Top Lehengas', price: 4800 },
      { name: 'Floral Lehengas', price: 4200 }, { name: 'Embroidered Lehengas', price: 7000 },
    ] },
    { id: 'maggam', label: 'Maggam Work', icon: Gem, items: [
      { name: 'Bridal Maggam Work', price: 4500 }, { name: 'Custom Maggam Work', price: 2200 },
      { name: 'Aari Work', price: 1800 }, { name: 'Hand Embroidery', price: 1500 },
      { name: 'Mirror Work', price: 1600 }, { name: 'Stone Work', price: 1700 },
      { name: 'Zardosi Work', price: 2400 },
    ] },
    { id: 'suits', label: 'Kurtis & Suits', icon: Layers, items: [
      { name: 'Cotton Kurtis', price: 600 }, { name: 'Rayon Kurtis', price: 700 },
      { name: 'Anarkali Kurtis', price: 1400 }, { name: 'A-Line Kurtis', price: 750 },
      { name: 'Straight Kurtis', price: 650 }, { name: 'Palazzo Sets', price: 1100 },
      { name: 'Punjabi Suits', price: 1300 }, { name: 'Churidar Sets', price: 1200 },
      { name: 'Salwar Suits', price: 1250 }, { name: 'Sharara Sets', price: 1800 },
      { name: 'Gharara Sets', price: 1900 },
    ] },
    { id: 'western', label: 'Western Wear', icon: ShoppingBag, items: [
      { name: 'Crop Tops', price: 500 }, { name: 'Tops', price: 550 },
      { name: 'Tunics', price: 700 }, { name: 'Co-ord Sets', price: 1200 },
      { name: 'Maxi Dresses', price: 1400 }, { name: 'Midi Dresses', price: 1200 },
      { name: 'Party Dresses', price: 1600 }, { name: 'Casual Dresses', price: 900 },
      { name: 'Jumpsuits', price: 1300 },
    ] },
    { id: 'family', label: 'Kids & Family', icon: Users, items: [
      { name: 'Girls Frocks', price: 900 }, { name: 'Kids Lehengas', price: 2200 },
      { name: 'Kids Gowns', price: 1600 }, { name: 'Ethnic Dresses', price: 1100 },
      { name: 'Festival Dresses', price: 1300 }, { name: 'Family Matching Sets', price: 2500 },
      { name: 'Mother-Daughter Dresses', price: 2800 }, { name: 'Couple Matching Outfits', price: 2600 },
      { name: 'Festival Family Wear', price: 3000 },
    ] },
  ];

  const couture = ['Luxury Silk Collection', 'Celebrity-Inspired Collection', 'Premium Designer Collection', 'Exclusive Limited Edition Collection', 'Handcrafted Collection', 'Festive Luxury Collection'];

  const services = [
    { icon: Scissors, label: 'Custom Stitching' }, { icon: Crown, label: 'Bridal Stitching' },
    { icon: RefreshCw, label: 'Alterations' }, { icon: Layers, label: 'Fall & Pico' },
    { icon: RotateCw, label: 'Saree Rolling' }, { icon: Shirt, label: 'Blouse Stitching' },
    { icon: Gem, label: 'Maggam Work' }, { icon: Users, label: 'Designer Consultation' },
    { icon: Palette, label: 'Fabric Selection' }, { icon: Zap, label: 'Express Delivery' },
  ];

  const whyUs = [
    { icon: Ruler, title: 'Made To Your Measurements', text: 'Every piece is cut and stitched to your exact measurements, not a size chart.' },
    { icon: Users, title: 'Design It With Us', text: 'Bring a photo, a sketch, or just an idea. We\u2019ll help you shape it into something wearable.' },
    { icon: Gem, title: 'Every Detail By Hand', text: 'From maggam embroidery to the final hem, the detail work is done by hand.' },
    { icon: MessageCircle, title: 'Talk To Us Directly', text: 'Message the boutique directly on WhatsApp for updates on your order.' },
  ];

  const stats = [
    { value: '60+', label: 'Styles & Designs' }, { value: '7', label: 'Signature Collections' },
    { value: '10', label: 'Boutique Services' }, { value: '100%', label: 'Made To Order' },
  ];

  const chapters = [
    { num: 'CHAPTER ONE', title: 'The Dream', text: 'A dream born from passion, tradition, and the desire to create something timeless. Sri Sai Boutique began with a simple belief: every woman deserves to feel confident in what she wears.' },
    { num: 'CHAPTER TWO', title: 'The Craft', text: 'Every stitch is placed by hand. Every fabric is chosen with care. From delicate maggam embroidery to a fitted bridal blouse, the craft is in the details you feel, not just see.' },
    { num: 'CHAPTER THREE', title: 'The Celebration', text: 'Weddings. Festivals. Family gatherings. The outfits made here become part of your most cherished memories \u2014 worn once, remembered forever.' },
    { num: 'CHAPTER FOUR', title: 'The Boutique', text: 'Today, Sri Sai Boutique is where tradition meets modern elegance \u2014 a home for brides, festival-goers, and women who want their clothing made just for them.' },
    { num: 'CHAPTER FIVE', title: 'The Future', text: 'This is an invitation. To walk in with an idea, and walk out with something made only for you. Welcome to the Sri Sai family.' },
  ];

  const testimonials = [
    { quote: 'The maggam work on my lehenga was even more detailed than the reference photo I brought in.', name: 'Bridal Customer' },
    { quote: 'Loved being able to choose the fabric in person and watch the design come together.', name: 'Regular Customer' },
    { quote: 'My daughter\u2019s festival frock fit her perfectly \u2014 she didn\u2019t want to take it off.', name: 'Festival Customer' },
  ];

  const galleryTiles = [
    { label: 'Bridal Look', tall: true, icon: Crown }, { label: 'Maggam Detail', tall: false, icon: Gem },
    { label: 'Festival Wear', tall: false, icon: Sparkles }, { label: 'Fabric Story', tall: true, icon: Layers },
    { label: 'Styled Shoot', tall: false, icon: Camera }, { label: 'Family Set', tall: false, icon: Users },
    { label: 'Behind The Scenes', tall: true, icon: Scissors }, { label: 'Everyday Elegance', tall: false, icon: Shirt },
  ];

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const activeProductItem = activeProduct ? activeCategory?.items.find((it) => it.name === activeProduct.productName) : null;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", backgroundColor: CHARCOAL_DEEP }} className="text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .font-display { font-family: 'Cinzel', serif; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          html { scroll-behavior: auto; }
        }
        a:focus-visible, button:focus-visible, input:focus-visible {
          outline: 1px solid ${CHAMPAGNE};
          outline-offset: 3px;
        }
      `}</style>

      <LoadingScreen visible={loaderVisible} progress={progress} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} total={cartTotal} />

      <a
        href={waLink('Hi Sri Sai Boutique, I\u2019d like to know more about your collections')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-6 right-6 flex items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{ width: 58, height: 58, backgroundColor: '#25D366', zIndex: 90, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
      >
        <MessageCircle size={26} color="#fff" />
      </a>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled || view !== 'home' ? 'rgba(23,19,15,0.92)' : 'transparent',
          borderBottom: scrolled || view !== 'home' ? `1px solid rgba(169,129,42,0.25)` : '1px solid transparent',
          backdropFilter: scrolled || view !== 'home' ? 'blur(10px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-20">
          <button onClick={goHome} className="font-display text-xl sm:text-2xl tracking-widest" style={{ color: CHAMPAGNE }}>
            SRI SAI BOUTIQUE
          </button>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }} className="text-sm tracking-wide text-stone-300 hover:text-white transition-colors cursor-pointer">
                {link.label}
              </a>
            ))}
            <button onClick={openTracking} className="text-sm tracking-wide text-stone-300 hover:text-white transition-colors">
              Track Order
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={openWishlist} className="relative" aria-label="Open wishlist">
              <Heart size={20} className="text-stone-300 hover:text-white transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full" style={{ width: 18, height: 18, backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP, fontSize: '10px' }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Open cart">
              <ShoppingCart size={20} className="text-stone-300 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full" style={{ width: 18, height: 18, backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP, fontSize: '10px' }}>
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href={waLink('Hi Sri Sai Boutique, I\u2019d like to place an order')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-sm tracking-wide flex items-center gap-2"
              style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}
            >
              <MessageCircle size={15} /> Order Now
            </a>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={openWishlist} className="relative" aria-label="Open wishlist">
              <Heart size={21} className="text-white" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full" style={{ width: 16, height: 16, backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP, fontSize: '9px' }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative" aria-label="Open cart">
              <ShoppingCart size={22} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full" style={{ width: 16, height: 16, backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP, fontSize: '9px' }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button className="text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-1" style={{ backgroundColor: 'rgba(23,19,15,0.98)' }}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }} className="text-stone-300 text-sm tracking-wide py-3 border-b border-stone-800 cursor-pointer">
                {link.label}
              </a>
            ))}
            <button onClick={() => { setMenuOpen(false); openTracking(); }} className="text-stone-300 text-sm tracking-wide py-3 text-left">
              Track Order
            </button>
          </div>
        )}
      </nav>

      {view === 'category' && (
        <CategoryPage category={activeCategory} cart={cart} wishlist={wishlist} onAddToCart={addToCart} onOpenProduct={openProduct} onToggleWishlist={toggleWishlist} onBack={goHome} />
      )}

      {view === 'product' && (
        <ProductPage category={activeCategory} product={activeProductItem} cart={cart} wishlist={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} onOpenProduct={openProduct} onBack={() => setView('category')} />
      )}

      {view === 'wishlist' && (
        <WishlistPage wishlist={wishlist} cart={cart} categories={categories} onAddToCart={addToCart} onOpenProduct={openProduct} onToggleWishlist={toggleWishlist} onBack={goHome} />
      )}

      {view === 'tracking' && <TrackOrderPage onBack={goHome} />}

      {view === 'home' && (
        <>
          {/* HERO */}
          <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 30%, #221C13 0%, ${CHARCOAL_DEEP} 70%)` }}>
            <Hero3D />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(23,19,15,0.15) 0%, rgba(23,19,15,0.82) 100%)' }} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full text-center pt-20">
              <p className="text-xs sm:text-sm tracking-widest mb-6" style={{ color: CHAMPAGNE }}>HANDCRAFTED &middot; MADE TO ORDER &middot; KHARMANGHAT</p>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-tight mb-6">
                Elegance, Tailored to You.
                <br />
                <span style={{ color: CHAMPAGNE }}>One Stitch at a Time.</span>
              </h1>
              <p className="text-stone-300 max-w-xl mx-auto mb-10 text-base sm:text-lg font-light">
                From bridal lehengas to designer blouses and maggam embroidery \u2014 every piece is made to fit your story, not just your size.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href={waLink('Hi Sri Sai Boutique, I\u2019d like to place an order')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 text-sm tracking-widest font-medium flex items-center gap-2 transition-transform hover:scale-105"
                  style={{ background: `linear-gradient(90deg, ${GOLD_ROYAL}, ${CHAMPAGNE})`, color: CHARCOAL_DEEP }}
                >
                  ORDER ON WHATSAPP <ArrowRight size={16} />
                </a>
                <a
                  href="#collections"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#collections'); }}
                  className="px-8 py-4 text-sm tracking-widest border text-stone-200 hover:border-white hover:text-white transition-colors cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  VIEW COLLECTIONS
                </a>
              </div>
            </div>
          </section>

          {/* COLLECTIONS GRID */}
          <section id="collections" className="py-20 sm:py-28 px-6 sm:px-10 scroll-mt-20" style={{ backgroundColor: CHARCOAL_DEEP }}>
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>THE FULL RANGE</p>
                  <h2 className="font-display text-3xl sm:text-5xl mb-4">Explore the Collections</h2>
                  <p className="text-stone-400 text-sm font-light">Tap a category to browse styles, then tap any product for sizing, pricing, and details.</p>
                </div>
              </FadeIn>
              <CategoryGrid categories={categories} onSelect={openCategory} />
            </div>
          </section>

          {/* MARQUEE */}
          <div className="py-5 overflow-hidden border-y" style={{ borderColor: 'rgba(169,129,42,0.25)', backgroundColor: CHARCOAL }}>
            <div className="flex whitespace-nowrap marquee-track">
              {[0, 1].map((i) => (
                <span key={i} className="flex items-center text-sm tracking-widest px-4" style={{ color: CHAMPAGNE }}>
                  CUSTOM STITCHING &nbsp;&middot;&nbsp; BRIDAL SPECIALISTS &nbsp;&middot;&nbsp; MAGGAM &amp; AARI WORK &nbsp;&middot;&nbsp; SAREE FALL &amp; PICO &nbsp;&middot;&nbsp; MADE TO MEASURE &nbsp;&middot;&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* STORY */}
          <FadeIn>
            <section id="story" className="py-24 sm:py-32 px-6 sm:px-10 scroll-mt-20" style={{ backgroundColor: IVORY }}>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>OUR STORY</p>
                  <h2 className="font-display text-3xl sm:text-5xl" style={{ color: CHARCOAL }}>Five Chapters, One Journey</h2>
                </div>
                <div className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(169,129,42,0.3)', transform: 'translateX(-50%)' }} />
                  {chapters.map((ch, i) => (
                    <FadeIn key={ch.title} delay={i * 0.05}>
                      <div className={`relative flex flex-col md:flex-row items-start gap-2 pb-16 last:pb-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD_ROYAL, transform: 'translate(-50%, 0)' }} />
                        <div className="md:w-1/2 pl-12 md:pl-0 md:px-10">
                          <p className="text-xs tracking-widest mb-2" style={{ color: GOLD_ROYAL }}>{ch.num}</p>
                          <h3 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: CHARCOAL }}>{ch.title}</h3>
                          <p className="italic font-light leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#4a4237', fontSize: '1.15rem' }}>{ch.text}</p>
                        </div>
                        <div className="hidden md:block md:w-1/2" />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* STATS */}
          <FadeIn>
            <section className="py-16 px-6 sm:px-10 border-y" style={{ borderColor: 'rgba(169,129,42,0.2)', backgroundColor: CHARCOAL }}>
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-3xl sm:text-4xl mb-1" style={{ color: CHAMPAGNE }}>{s.value}</p>
                    <p className="text-xs tracking-wide text-stone-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* COUTURE */}
          <section className="py-20 px-6 sm:px-10" style={{ backgroundColor: CHARCOAL_DEEP }}>
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-12">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>THE ELEVATED TIER</p>
                  <h2 className="font-display text-3xl sm:text-4xl">Bridal Couture</h2>
                </div>
              </FadeIn>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {couture.map((item, i) => (
                  <FadeIn key={item} delay={i * 0.06}>
                    <div className="flex items-center gap-3 px-6 py-5 transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(169,129,42,0.14), rgba(199,154,130,0.08))', border: '1px solid rgba(232,217,176,0.25)' }}>
                      <Sparkles size={18} style={{ color: CHAMPAGNE }} className="flex-shrink-0" />
                      <span className="text-sm tracking-wide">{item}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="py-24 sm:py-32 px-6 sm:px-10 scroll-mt-20" style={{ backgroundColor: CHARCOAL }}>
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>BOUTIQUE SERVICES</p>
                  <h2 className="font-display text-3xl sm:text-5xl">From Idea to Outfit</h2>
                </div>
              </FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {services.map((s, i) => (
                  <FadeIn key={s.label} delay={i * 0.04}>
                    <div className="flex flex-col items-center text-center gap-3 px-4 py-8" style={{ backgroundColor: 'rgba(232,217,176,0.06)', border: '1px solid rgba(232,217,176,0.15)' }}>
                      <s.icon size={22} style={{ color: CHAMPAGNE }} strokeWidth={1.4} />
                      <span className="text-xs tracking-wide text-stone-300">{s.label}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* WHY US */}
          <FadeIn>
            <section className="py-24 sm:py-32 px-6 sm:px-10" style={{ backgroundColor: IVORY }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>OUR APPROACH</p>
                  <h2 className="font-display text-3xl sm:text-5xl" style={{ color: CHARCOAL }}>Why Sri Sai Boutique</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {whyUs.map((w) => (
                    <div key={w.title} className="p-6" style={{ backgroundColor: PEARL, border: '1px solid rgba(169,129,42,0.2)' }}>
                      <w.icon size={24} style={{ color: GOLD_ROYAL }} strokeWidth={1.3} className="mb-4" />
                      <h3 className="font-display text-lg mb-2" style={{ color: CHARCOAL }}>{w.title}</h3>
                      <p className="text-sm font-light leading-relaxed text-stone-600">{w.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* GALLERY */}
          <section id="gallery" className="py-24 sm:py-32 px-6 sm:px-10 scroll-mt-20" style={{ backgroundColor: CHARCOAL_DEEP }}>
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>THE LOOKBOOK</p>
                  <h2 className="font-display text-3xl sm:text-5xl">Gallery</h2>
                  <p className="text-stone-400 text-sm mt-4 font-light">Sample layout &mdash; swap in real shoot photos before launch.</p>
                </div>
              </FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: '140px' }}>
                {galleryTiles.map((tile, i) => (
                  <FadeIn key={tile.label} delay={i * 0.03} className={tile.tall ? 'row-span-2' : ''}>
                    <div className="relative w-full h-full overflow-hidden">
                      <MediaTile image={tile.image} Icon={tile.icon} variant={i} alt={tile.label} />
                      <div className="absolute inset-0 flex items-end p-4" style={{ background: 'linear-gradient(0deg, rgba(23,19,15,0.8) 0%, transparent 60%)' }}>
                        <span className="text-xs tracking-widest">{tile.label}</span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="py-24 sm:py-32 px-6 sm:px-10" style={{ backgroundColor: IVORY }}>
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-16">
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>TESTIMONIALS</p>
                  <h2 className="font-display text-3xl sm:text-5xl" style={{ color: CHARCOAL }}>In Their Words</h2>
                  <p className="text-stone-500 text-sm mt-4 font-light">Sample quotes &mdash; replace with real customer reviews.</p>
                </div>
              </FadeIn>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <FadeIn key={t.name} delay={i * 0.1}>
                    <div className="p-8 h-full" style={{ backgroundColor: PEARL, border: '1px solid rgba(169,129,42,0.25)' }}>
                      <div className="flex gap-1 mb-4">
                        {[0, 1, 2, 3, 4].map((j) => (
                          <Star key={j} size={14} fill={GOLD_ROYAL} style={{ color: GOLD_ROYAL }} />
                        ))}
                      </div>
                      <p className="text-stone-700 font-light leading-relaxed mb-6 italic">"{t.quote}"</p>
                      <p className="text-sm tracking-wide" style={{ color: GOLD_ROYAL }}>{t.name}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* VISIT / CONTACT */}
          <section id="visit" className="py-24 sm:py-32 px-6 sm:px-10 scroll-mt-20" style={{ backgroundColor: CHARCOAL }}>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              <FadeIn>
                <div>
                  <p className="text-xs tracking-widest mb-4" style={{ color: GOLD_ROYAL }}>VISIT US</p>
                  <h2 className="font-display text-3xl sm:text-5xl mb-8">Come See Us In Person</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin size={20} style={{ color: CHAMPAGNE }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Address</p>
                        <p className="text-sm font-light text-stone-400">{ADDRESS}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone size={20} style={{ color: CHAMPAGNE }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Call or WhatsApp</p>
                        <p className="text-sm font-light text-stone-400">{PHONE_DISPLAY}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock size={20} style={{ color: CHAMPAGNE }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Timings</p>
                        <p className="text-sm font-light text-stone-400">Message us on WhatsApp to confirm today's hours before you visit.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail size={20} style={{ color: CHAMPAGNE }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Email</p>
                        <a href={`mailto:${EMAIL}`} className="text-sm font-light text-stone-400 hover:text-white transition-colors">{EMAIL}</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <a
                      href={waLink('Hi Sri Sai Boutique, I\u2019d like to visit the store')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm tracking-wide flex items-center gap-2"
                      style={{ backgroundColor: GOLD_ROYAL, color: CHARCOAL_DEEP }}
                    >
                      <MessageCircle size={16} /> WhatsApp Us
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm tracking-wide border flex items-center gap-2"
                      style={{ borderColor: 'rgba(232,217,176,0.4)', color: CHAMPAGNE }}
                    >
                      <MapPin size={16} /> Get Directions
                    </a>
                    <a
                      href={MAPS_SHARE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm tracking-wide border flex items-center gap-2"
                      style={{ borderColor: 'rgba(232,217,176,0.4)', color: CHAMPAGNE }}
                    >
                      <MapPin size={16} /> View on Google Maps
                    </a>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="w-full h-80 md:h-full overflow-hidden" style={{ border: '1px solid rgba(169,129,42,0.3)' }}>
                  <iframe
                    title="Sri Sai Boutique Location"
                    src={`https://www.google.com/maps?q=${LAT},${LNG}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </FadeIn>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="pt-20 pb-8 px-6 sm:px-10" style={{ backgroundColor: CHARCOAL_DEEP }}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-display text-xl tracking-widest" style={{ color: CHAMPAGNE }}>SRI SAI BOUTIQUE</span>
            <p className="text-stone-400 text-sm font-light mt-4 leading-relaxed">
              Custom bridal wear, blouses, and maggam embroidery, stitched in Kharmanghat.
            </p>
            <div className="flex gap-4 mt-6">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} className="text-stone-400 hover:text-white cursor-pointer transition-colors" />
              </a>
              <Facebook size={18} className="text-stone-500" />
              <a href={`mailto:${EMAIL}`} aria-label="Email">
                <Mail size={18} className="text-stone-400 hover:text-white cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest text-stone-500 mb-4">SHOP</p>
            <ul className="space-y-3 text-sm text-stone-300 font-light">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => openCategory('bridal')}>Bridal Collection</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => openCategory('blouses')}>Blouses</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => openCategory('maggam')}>Maggam Work</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-widest text-stone-500 mb-4">COMPANY</p>
            <ul className="space-y-3 text-sm text-stone-300 font-light">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('#story')}>Our Story</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('#gallery')}>Gallery</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={openWishlist}>Wishlist</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-widest text-stone-500 mb-4">SUPPORT</p>
            <ul className="space-y-3 text-sm text-stone-300 font-light">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('#visit')}>Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={openTracking}>Track Order</li>
              <li className="hover:text-white cursor-pointer transition-colors">Return Policy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(169,129,42,0.15)' }}>
          <p className="text-xs text-stone-500">&copy; 2026 Sri Sai Boutique. All rights reserved.</p>
          <p className="text-xs text-stone-500">Privacy Policy &middot; Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}

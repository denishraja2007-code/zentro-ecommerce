const colors = {
  electronics: ["#4f46e5", "#7c3aed"],
  fashion: ["#db2777", "#f43f5e"],
  home: ["#059669", "#10b981"],
  sports: ["#ea580c", "#f59e0b"],
};

export const productImage = (product) => {
  if (product?.image && product.image.startsWith("http") && !product.image.includes("placehold.co")) {
    return product.image;
  }
  const [c1, c2] = colors[product?.category] || ["#4f46e5", "#7c3aed"];
  const name = (product?.name || "Product").replace(/[<>&"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <text x="300" y="300" font-family="Arial, sans-serif" font-size="44" font-weight="bold"
      fill="white" text-anchor="middle" dominant-baseline="middle">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
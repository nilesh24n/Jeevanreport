import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getProductByBarcode(barcode: string) {
  try {
    if (!supabase) return null;
    const clean = barcode.replace(/\D/g, "");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", clean)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data?.data || data;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function searchProducts(query: string, limit = 20) {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("products")
      .select("id, barcode, name, brand, category, trust_score, trust_level")
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error("Search error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Supabase search error:", err);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }

    return data?.data || data;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function searchProductsByCategory(category: string, limit = 50) {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("products")
      .select("id, barcode, name, brand, category, trust_score, trust_level")
      .eq("category", category)
      .limit(limit);

    if (error) {
      console.error("Category search error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "shrinkflation-in-indian-packaged-foods-2018-2026-report",
    title: "Shrinkflation in Indian Packaged Foods (2018–2026): The Sacred Price Points & The Parle-G Economic Index",
    excerpt: "From Maggi's July 2026 portfolio cuts to Parle-G's 50% 30-year weight drop, explore our comprehensive public report on pack-size reductions in India.",
    date: "2026-10-17",
    author: "JeevanReport Research Desk",
    tags: ["Shrinkflation", "FMCG", "Consumer Rights", "Data Analysis", "Parle-G", "Maggi"],
    content: `
No official or industry body publishes a complete list of pack-weight changes for every packaged product sold in India. There are hundreds of thousands of SKUs, and consumer goods companies are not legally required to publicly trumpet package reductions. 

At JeevanReport, our research team compiled publicly documented cases of shrinkflation across biscuits, noodles, snacks, soaps, and beverages from 2018 through late 2026. Here is the unvarnished analysis of what the data shows.

[Read the interactive 2018–2026 Shrinkflation Investigation Dossier with live calculator and 19 verified sources here](/shrinkflation).

---

### Key Findings at a Glance

1. **The 'Sacred' & 'Magic' Price Points (₹5, ₹10, ₹20):** Dabur's CEO calls ₹1, ₹5, and ₹10 "sacred" price points, while Hindustan Unilever (HUL) terms them "magic" price thresholds. Because small coins define daily cash purchases in India's 1.2+ crore kiranas, brands cannot raise nominal prices without causing catastrophic volume drops. Weight is what moves.
2. **Maggi July 2026 Cuts Across Portfolio:** Nestlé India revised net weights across virtually its entire Maggi line in July 2026 while leaving MRPs untouched. The ₹7 pack dropped from 35g to 32g (-8.6%), the ₹10 pack dropped from 52g to 48g (-7.7%), and family 4-packs/8-packs dropped by ~6.7%, creating an immediate 7–9.4% effective hike in price per gram.
3. **The Parle-G Economic Index:** In 1994, a 100g pack of Parle-G sold for ₹4 (₹0.04/g). Over three decades, the pack reduced to 80g, 76g in 2018, 55g in 2021 at ₹5, and today sits at 45–50g in mid-2020s retail checks. The ₹5 pack has literally halved in size, doubling the real cost per gram.
4. **2026 Crude & Palm Oil Pressure:** High crude oil prices, edible palm oil surges, and plastic polymer costs have driven companies like Dabur, Britannia, Godrej Consumer, and Marico to implement a dual strategy: grammage cuts on ₹10 and ₹20 packs alongside direct price increases on larger SKUs.
5. **The GST 2.0 Episode:** When GST on biscuits, soaps, and noodles was reduced from 18% to 5% on 22 September 2025, odd-coin pricing (e.g. ₹4.45 Parle-G, 88 paise candy) caused retail friction. While CBIC clarified that firms could add 6–12% more weight at standard price points, subsequent 2026 cost pressures quickly reclaimed those temporary gains.

---

### Top Documented Pack-Size Cuts

| Product & SKU | Brand | Price Point | Before | After | Pack Cut % | Price/g Rise % | Period |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Parle-G Gluco Biscuits** | Parle | ₹5 | 100g | ~48g | **-52.0%** | **+100.0%** | Multi-decade |
| **Lay's Potato Chips** | PepsiCo | Standard | 40g | 30g | **-25.0%** | **+33.3%** | 2021–2023 |
| **Haldiram's Aloo Bhujia** | Haldiram's | Same price | 55g | 42g | **-23.6%** | **+31.0%** | 2022 |
| **Lahori Zeera Beverage** | Lahori | Same price | 200ml | 160ml | **-20.0%** | **+25.0%** | 2020–2022 |
| **Vim Dish-wash Bar** | HUL | ₹10 | 155g | 135g | **-12.9%** | **+14.8%** | 2022 |
| **Kurkure Masala Munch** | PepsiCo | ₹10 | 55g | 50g | **-9.1%** | **+10.0%** | 2020–2024 |
| **Maggi Noodles (Mini)** | Nestlé India | ₹7 | 35g | 32g | **-8.6%** | **+9.4%** | July 2026 |
| **Maggi Noodles (Small)** | Nestlé India | ₹10 | 52g | 48g | **-7.7%** | **+8.3%** | July 2026 |
| **Maggi Standard Single** | Nestlé India | ₹15 | 75g | 70g | **-6.7%** | **+7.1%** | July 2026 |
| **Good Day Butter Cookies** | Britannia | ₹10 | 72g | 66g | **-8.3%** | **+9.1%** | 2024 |

---

### Why Small Packs Matter to Indian Households

Small packs are not minor impulse treats in India; they are how the country consumes FMCG essentials. In September 2025 retail checks:
- **79% of shampoo sales** come from sachets (₹1, ₹2, ₹3).
- **64% of all biscuit sales** come from packs priced ₹10 or below.
- **58% of chocolates** and **44% of salty namkeen snacks** sit in low-value price points.

For low-income and working-class families, shaving 5g from a ₹10 pack is an invisible 10% tax on essential nutrition and home hygiene.

---

### Know Your Rights Under Legal Metrology

Under the **Legal Metrology (Packaged Commodities) Rules, 2011** (effective 1 April 2022), manufacturers are legally required to declare the **unit sale price** (₹ per gram or ₹ per millilitre) on every retail packet alongside the MRP. 

If you suspect short quantity, deceptive packaging, or misleading weight declarations:
1. Note the net weight and MRP printed on the back panel.
2. Calculate price per 100g: \`(MRP ÷ Weight) × 100\`.
3. Report violations directly to the Government of India's **National Consumer Helpline (1915)** at [consumerhelpline.gov.in](https://consumerhelpline.gov.in).
    `
  },
  {
    slug: "what-is-shrinkflation-indian-brands",
    title: "What is Shrinkflation? How Indian Brands Adjust Pack Sizes",
    excerpt: "Have you noticed your favorite biscuit packet feels lighter or soap bar got smaller, but the price remained exactly the same? That is shrinkflation. Learn how it works in India.",
    date: "2024-05-15",
    author: "JeevanReport Team",
    tags: ["Shrinkflation", "Consumer Rights", "India"],
    content: `
Have you ever opened a packet of your favorite potato chips or chocolate bar and felt that the contents were unusually sparse, even though you paid the exact same price as always? If so, you are not imagining things. You are observing a widespread retail strategy known as "shrinkflation."

### What is Shrinkflation?

Shrinkflation is a portmanteau of the words "shrink" and "inflation." It refers to the practice of reducing the size or quantity of a product while keeping its retail price the same. In some cases, the price might even increase, compounding the effect. Rather than raising the price of a product directly—which consumers notice immediately and react to by buying less—manufacturers quietly reduce the volume, weight, or count of the product.

Because the packaging and price remain virtually identical, most shoppers do not realize they are paying more per unit (per gram, milliliter, or sheet) for the product. It is a stealthy form of inflation that eats away at consumer purchasing power.

### Why Do Brands Do It?

The primary driver behind shrinkflation is rising input costs. Manufacturers face fluctuating expenses for raw ingredients (like milk, sugar, cocoa, wheat), packaging materials, labor, transport, and energy. When these costs rise, companies have three main choices to maintain their profit margins:

1. **Raise the retail price:** This is direct and highly visible, which can cause consumers to switch to cheaper competitors.
2. **Reformulate the product:** Using cheaper ingredients (like substituting palm oil for butter), which can degrade product quality and damage brand reputation.
3. **Shrink the product:** Keep the price and look the same but reduce the amount. This is often the most successful strategy for companies because humans are highly visual creatures who focus on prices rather than weight details.

### How Indian Brands Are Practicing Shrinkflation

In India, shrinkflation has become highly prevalent, particularly in fast-moving consumer goods (FMCG). Popular products like instant noodles, biscuits, soaps, and detergents have all undergone weight reductions. 

For instance, Nestlé India's classic Maggi 2-Minute Masala Noodles has seen its single pack size drop over the years. What once was a robust 100-gram pack shrunk to 85g, then 80g, 75g, and recently to 70g, while maintaining its iconic pricing tiers or increasing them slightly. Similarly, biscuit giants like Britannia and Parle have reduced packet weights by 5% to 10% on their popular ₹5 and ₹10 offerings.

These small reductions—say, dropping a soap bar from 100g to 90g—might seem negligible individually, but they add up to a significant price hike per kilogram. For a middle-class Indian household buying dozens of FMCG goods monthly, shrinkflation quietly inflates the monthly grocery bill by hundreds of rupees.

### How to Spot and Avoid Shrinkflation

As a consumer, you are not completely powerless. Here are steps you can take to protect your wallet:

* **Always Check Unit Prices:** Instead of looking at the overall price, look at the price per unit (e.g., price per 100g or per liter). Compare brands based on unit price to find the true value.
* **Inspect the Net Weight:** Get into the habit of checking the net quantity printed on the back of the packaging. Don't rely on package dimensions, as air and cardboard fillers can make a pack look larger than its actual content.
* **Scan with JeevanReport:** Use JeevanReport.in to search or scan products. We actively track the pack size history of Indian products, showing you exactly when and by how much a brand has reduced its size.
* **Buy in Bulk:** Larger family packs or bulk sizes often offer a much lower unit price and are less susceptible to sudden weight reductions compared to small single-serve packs.
* **Consider Store Brands or Local Alternatives:** Smaller local brands or supermarket store brands often provide similar quality at a lower unit price because they don't spend heavily on marketing and advertising.

Shrinkflation is a legal but deceptive practice. By becoming a vigilant shopper and using tools like JeevanReport, you can make informed decisions and refuse to pay more for less.
    `
  },
  {
    slug: "how-to-read-nutrition-labels-indians",
    title: "How to Read Nutrition Labels: A Simple Guide for Indians",
    excerpt: "Reading nutritional information on packaged food can be confusing. Here is a simplified guide tailored specifically for Indian consumers to make healthier choices.",
    date: "2024-06-10",
    author: "JeevanReport Nutritionist Team",
    tags: ["Nutrition", "Healthy Eating", "Guide"],
    content: `
Walking down a grocery store aisle in India, you are surrounded by terms like "Active Fit," "Sugar-Free," "High Protein," and "100% Natural." These buzzwords are designed by marketing teams to make products appear healthy. The only way to know the truth is to turn the package over and read the nutrition facts panel and the ingredients list.

For many Indians, however, the nutrition table looks like a foreign language. What is the difference between total sugars and added sugars? How much sodium is too much? Here is a simple, step-by-step guide to reading nutrition labels in India.

### Step 1: Start with the Serving Size

The serving size is the most critical starting point. All the values listed on the nutrition table (calories, fat, sugar, sodium) are usually given **per 100g** or **per serving**. 

A common trick brands play is showing low numbers by making the serving size unrealistically small. For example, a bottle of fruit juice might show only 50 calories per serving, but the serving size is defined as 100ml while the bottle contains 300ml. If you drink the whole bottle, you are consuming three times the listed calories and sugar. Always multiply the per-serving values by the number of servings you actually eat.

### Step 2: Check the Calories (Energy)

Calories measure how much energy you get from a serving of food. 
* As a general guide for a standard 2,000-calorie daily diet:
  * **Low calorie:** 40 calories or less per serving.
  * **Moderate calorie:** 100-200 calories per serving.
  * **High calorie:** 250 calories or more per serving.
If you are trying to manage weight, pay close attention to energy density, especially in snacks and liquid beverages which can pack high calories without filling you up.

### Step 3: Identify the Red Flags (Sugar, Sodium, Saturated Fat)

These are the nutrients you generally want to limit. In the Indian diet, excess sodium and sugar are major contributors to hypertension, diabetes, and heart disease.

* **Added Sugars:** Packaged foods in India are now beginning to specify "Added Sugar" separately from natural sugars. Try to avoid products where added sugar is high. A good rule of thumb is to look for less than 5g of total sugar per 100g.
* **Sodium (Salt):** High sodium is extremely common in Indian instant foods, pickles, namkeens, and sauces. Limit your sodium intake. The recommended daily limit is 2,000mg of sodium (about 1 teaspoon of salt). Avoid products with more than 400mg of sodium per 100g.
* **Saturated & Trans Fats:** Saturated fat should be limited, and trans fat should be zero. Check for ingredients like "hydrogenated vegetable oil" or "vanaspati," which indicate harmful trans fats.

### Step 4: Look for Positive Nutrients (Protein, Fiber)

Protein and fiber are nutrients you want more of because they keep you full, build muscle, and support digestion.
* **Dietary Fiber:** Look for foods with at least 3g of fiber per serving. Fiber helps control blood sugar spikes.
* **Protein:** Particularly important for vegetarians in India. Aim for products that offer a decent amount of protein per serving (at least 5g for snacks, and higher for meals).

### Step 5: Read the Ingredients List (The Golden Rule)

The ingredients list is actually more important than the nutrition numbers. Ingredients are listed in **descending order by weight**. Whatever ingredient is listed first, second, or third is what the product is mostly made of.

If the first three ingredients are "sugar," "refined wheat flour (maida)," and "palm oil," you are essentially buying a flour-sugar-oil mixture, regardless of any healthy claims on the front. Look out for chemical names, artificial sweeteners, preservatives, and coloring agents. If you cannot pronounce an ingredient, it is likely an additive.

### Simplify Your Shopping with JeevanReport

If checking tables and doing math sounds exhausting, let JeevanReport do it for you. Our platform instantly extracts nutrition values, flags high sodium/sugar levels, decodes complex ingredients, and computes an overall rating (Good, Careful, or Limit) so you can make healthy choices in seconds.

Reading labels takes only a few extra seconds, but it is one of the most powerful steps you can take to secure long-term health for you and your family.
    `
  },
  {
    slug: "top-10-most-shrunk-products-india-2024",
    title: "Top 10 Most Shrunk Products in India 2024",
    excerpt: "We compiled our database records to find the worst offenders of shrinkflation in India this year. See which household favorites cut sizes the most.",
    date: "2024-11-20",
    author: "JeevanReport Data Lab",
    tags: ["Shrinkflation", "Data Analysis", "FMCG"],
    content: `
As inflation continues to squeeze household budgets across India, packaged food and home-care companies are responding with their favorite tactic: shrinkflation. By reducing packet sizes while keeping prices at popular price points (like ₹10, ₹20, or ₹50), brands pass cost increases onto consumers without triggering price-tag shock.

Our database at JeevanReport tracks thousands of product changes in India. Here are the top 10 most shrunk products in India in 2024 based on volume/weight reductions:

### The Worst Shrinkflation Offenders of 2024

| Product Name | Brand | Category | Old Weight | New Weight | Reduction % | Price |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Liquid Handwash Refill | Dettol | Household | 200ml | 175ml | -12.5% | ₹99 |
| Mango Greek Yogurt | Epigamia | Food | 100g | 90g | -10.0% | ₹60 |
| Masala Munch Snack | Kurkure | Snacks | 90g | 82g | -8.9% | ₹20 |
| Good Day Butter Cookies | Britannia | Snacks | 72g | 66g | -8.3% | ₹10 |
| Adult Chicken Dry Food | Pedigree | Pet Food | 1.3 kg | 1.2 kg | -7.7% | ₹420 |
| 2-Minute Masala Noodles | Maggi | Food | 75g | 70g | -6.7% | ₹14 |
| Clinic Plus Shampoo | Clinic Plus | Personal Care| 355ml | 340ml | -4.2% | ₹180 |
| Dishwash Tub Bar | Vim | Household | 500g | 475g | -5.0% | ₹65 |
| Marie Gold Biscuits | Britannia | Snacks | 250g | 235g | -6.0% | ₹35 |
| Kesar Flavoured Milk | Amul | Beverages | 200ml | 180ml | -10.0% | ₹25 |

### Analysis of the Trends

1. **The ₹10 Price Point Trap:** Biscuit and snack manufacturers are heavily reliant on the ₹5 and ₹10 price points in India because they represent major volume sales in rural and semi-urban markets. Instead of raising the price to ₹11 or ₹12, which breaks consumer habits and rural coin-exchanges, brands consistently shave grams off the package. Britannia Good Day and Kurkure are classic examples of this strategy.
2. **Personal and Home Care Refill Packaging:** Refill bags and liquid handwashes are marketed as "value packs." However, Dettol and Clinic Plus have quietly adjusted volumes downwards, meaning the cost per milliliter has risen substantially.
3. **Dairy and Premium Snacks:** Fresh yogurts and processed dairy items like Greek yogurt face direct milk cost inflation. Epigamia reduced its premium cups by a massive 10%, which translates to a direct 10% unit price hike for health-conscious consumers.

### How Consumers Can Fight Back

* **Stop buying standard snack packs:** Switch to local brands or generic alternatives that haven't adopted shrinkflation.
* **Spread the word:** Share these findings on social media. Public awareness forces brands to be more transparent.
* **Scan before you buy:** Keep checking JeevanReport.in to stay updated on which products are being shrunk. We verify every report with real packaging photos submitted by users like you.
    `
  },
  {
    slug: "is-maggi-really-unhealthy-we-scanned-it",
    title: "Is Maggi Really Unhealthy? We Scanned It So You Don't Have To",
    excerpt: "Maggi Masala Noodles is India's ultimate comfort food, but how does it rate on nutritional transparency? We scanned the data and decoded the ingredients.",
    date: "2024-08-05",
    author: "JeevanReport Food Science Lab",
    tags: ["Maggi", "Processed Food", "Analysis"],
    content: `
For generations of Indians, Maggi noodles has been more than just food; it is an emotion. From college hostels to mountain roads, the yellow package promises comfort in two minutes. However, behind the delicious taste lies a product that has faced intense scrutiny regarding lead content, MSG, and nutrition quality.

We ran Maggi 2-Minute Masala Noodles through the JeevanReport scanning engine to analyze its ingredients and nutritional value. Here is the objective truth.

### The Nutritional Breakdown (Per 70g Serving)

When you consume one single pack of Maggi Masala Noodles, here is what goes into your body:
* **Calories:** ~310 kcal (approx. 15% of your daily energy needs).
* **Sodium (Salt):** ~760mg. This is a massive **38% of the daily recommended limit** for an adult in a single small snack.
* **Protein:** ~5.8g (mostly from refined flour, lacking completeness).
* **Fiber:** ~1.4g (extremely low).
* **Saturated Fat:** ~5.5g (primarily from palm oil).

### Decoding the Ingredients List

If we look at the ingredients list of Maggi, we find refined wheat flour (maida) is the first and primary ingredient. Maida is stripped of fiber, vitamins, and minerals, leading to rapid blood sugar spikes.

Next, the cooking fat used is palm oil, which is high in saturated fats and raises LDL (bad) cholesterol levels when eaten frequently.

The tastemaker contains multiple flavor enhancers and acidity regulators:
* **Hydrolyzed Groundnut Protein:** A processed plant protein used to enhance savory taste.
* **Flavor Enhancers (INS 635, INS 627):** These are chemical additives that work alongside MSG (naturally occurring or added) to create the addictive umami taste.
* **Thickeners and Gums:** Used to improve the noodle texture and chewiness.

### The Shrinkflation Factor

Maggi is also a classic example of shrinkflation in India. Over the years, the weight of the standard pack has dropped from 75g to 70g. While ₹14 remains the stable entry point, you are getting less food for your money than before.

### The Verdict: How Often Can You Eat It?

Our system rates Maggi Masala Noodles as **Limit Often (Be Careful / Red Flag)**. 

Eating Maggi once in a while as a treat will not harm a healthy person. However, consuming it daily or multiple times a week as a meal replacement is highly unhealthy. It lacks protein and fiber while overloading your system with sodium and refined flour, leading to poor satiety and blood sugar crashes.

**Healthy Tips if You Do Cook It:**
1. **Add Vegetables:** Throw in carrots, peas, beans, and spinach to add fiber and vitamins.
2. **Add Protein:** Crack an egg, toss in paneer cubes, or add boiled chicken to improve the satiety index.
3. **Use Less Tastemaker:** Use only half of the tastemaker packet to cut your sodium intake in half.
    `
  },
  {
    slug: "gym-nutrition-guide-read-protein-labels",
    title: "Gym Nutrition Guide: How to Read Protein Labels",
    excerpt: "Fitness enthusiasts are constantly searching for clean protein. Learn how to read protein bars, powders, and high-protein snack labels to avoid high-sugar traps.",
    date: "2024-10-12",
    author: "JeevanReport Fitness Coach Team",
    tags: ["Gym Mode", "Protein", "Fitness"],
    content: `
If you hit the gym regularly or play sports, you know that protein is key for building muscle and burning fat. In response to the growing fitness trend in India, brands are launching "High Protein" products like protein bars, protein cookies, Greek yogurts, and mueslis.

Unfortunately, many of these "fitness foods" are sugar-loaded candy bars in disguise. Here is the ultimate guide to reading labels like a gym professional.

### 1. Calculate the Calorie-to-Protein Ratio (CPR)

For fitness goals, you want to get the maximum amount of protein for the fewest calories, especially during a cutting phase. 
* To calculate the CPR:
  $$\\text{CPR} = \\frac{\\text{Total Calories}}{\\text{Protein (grams)}}$$
* **CPR Rating:**
  * **10 or less:** Excellent. (e.g., Whey isolate: 120 cal / 25g protein = 4.8 CPR).
  * **10 to 20:** Good/Moderate. Suitable for bulking or general fitness snack.
  * **20 or more:** Poor. You are consuming too many calories/carbs/fats for very little protein. Avoid these if fat loss is your goal.

### 2. Verify the Protein Source (Completeness)

Not all proteins are created equal. Your muscles need all 9 essential amino acids to build tissue. 
* **Complete Protein Sources (High Bioavailability):** Whey, casein, milk protein concentrate, soy protein isolate, egg white, chicken, fish.
* **Incomplete Protein Sources (Lower Bioavailability):** Wheat gluten, pea protein (unless combined), nuts, seeds, gelatin.
If a "high protein cookie" lists wheat gluten or soy flour as its main protein source, it won't trigger muscle growth as efficiently as whey or milk protein.

### 3. Watch Out for the Sugar Trap

Many protein bars taste delicious because they are packed with sugar, glucose syrup, or maltodextrin. A bar with 20g of protein but 25g of sugar is not a healthy choice.
* **Aim for:** Less than 5g of sugar per bar.
* **Watch out for Sugar Alcohols (Maltitol, Sorbitol):** These are low-calorie sweeteners that can cause major gas, bloating, and digestive distress in high quantities.

### 4. Decode Pre- vs Post-Workout Suitability

The ideal macro profile depends on when you consume it:
* **Pre-Workout:** You need fast-digesting carbohydrates for energy, low fat, and low fiber (which slow digestion and cause sluggishness).
* **Post-Workout:** You need protein for muscle repair, alongside moderate carbs to replenish glycogen stores. Saturated fat should be low as it slows nutrient absorption.

### How JeevanReport Gym Mode Simplifies Your Fitness Journey

Checking all these variables on every product is time-consuming. That is why we built **Gym Mode** directly into JeevanReport. When you scan a product and toggle "For Gym", our engine instantly calculates the CPR ratio, identifies protein completeness, gives muscle-building ratings, and provides a clear bulking vs cutting verdict.

Make sure you read the labels before you fuel your workouts. Your muscles will thank you.
    `
  }
];
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

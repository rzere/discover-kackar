// Script to update all categories with content
const categories = [
  {
    id: 'c039acbd-a162-4833-8009-dbebe2adeef4',
    slug: 'nature',
    content: {
      header: "Discover the Untamed Beauty of Kaçkar Mountains",
      bullets: [
        "Over 50 pristine alpine lakes",
        "3,937m highest peak - Kaçkar Dağı", 
        "Endemic flora and fauna",
        "Ancient forests and meadows",
        "Crystal clear mountain streams"
      ],
      body: "The Kaçkar Mountains offer an unparalleled natural experience with their pristine wilderness, glacial lakes, and diverse ecosystems. From the highest peak at 3,937 meters to the crystal-clear alpine lakes, every corner of this region tells a story of natural wonder. The area is home to endemic species found nowhere else in the world, making it a paradise for nature enthusiasts and wildlife photographers."
    }
  },
  {
    id: '9d277bcd-692e-4b32-9f34-eabe91f94b83',
    slug: 'culture',
    content: {
      header: "Immerse Yourself in Ancient Traditions",
      bullets: [
        "Traditional Laz and Hemshin communities",
        "Ancient monasteries and churches",
        "Local handicrafts and textiles",
        "Traditional music and dance",
        "Authentic village life"
      ],
      body: "The Kaçkar region is a cultural treasure trove where ancient traditions have been preserved for centuries. The local Laz and Hemshin communities maintain their unique customs, language, and way of life. Visitors can experience authentic village life, witness traditional ceremonies, and learn about the rich cultural heritage that has shaped this mountain region."
    }
  },
  {
    id: '8def656a-f38e-4c46-9000-65c6e707fcbe',
    slug: 'gastronomy',
    content: {
      header: "Savor the Authentic Flavors of Black Sea Cuisine",
      bullets: [
        "Fresh mountain trout and seafood",
        "Traditional corn bread and local cheeses",
        "Organic honey and mountain herbs",
        "Traditional tea ceremonies",
        "Local wine and spirits"
      ],
      body: "The culinary traditions of the Kaçkar region reflect the unique blend of mountain and coastal influences. Fresh ingredients from the mountains and the Black Sea create a distinctive cuisine that has been perfected over generations. From the famous mountain trout to traditional corn bread and local cheeses, every meal tells the story of this rich culinary heritage."
    }
  },
  {
    id: 'ecb3cbfd-32cc-4d66-877b-58c9f1c87fca',
    slug: 'adventure',
    content: {
      header: "Embark on Epic Mountain Adventures",
      bullets: [
        "Multi-day trekking routes",
        "Mountaineering to 3,937m peak",
        "Highland camping experiences",
        "Rock climbing and bouldering",
        "Photography expeditions"
      ],
      body: "For adventure seekers, the Kaçkar Mountains offer some of Turkey's most challenging and rewarding outdoor experiences. From multi-day trekking routes through pristine wilderness to mountaineering expeditions to the highest peaks, the region provides endless opportunities for adrenaline-fueled adventures. Whether you're a seasoned mountaineer or a beginner hiker, there's an adventure waiting for you."
    }
  },
  {
    id: '5283ce1d-5d32-4946-ab04-b8877c251f23',
    slug: 'accommodation',
    content: {
      header: "Stay in Authentic Mountain Accommodations",
      bullets: [
        "Traditional highland houses",
        "Cozy guesthouses with local charm",
        "Mountain camping sites",
        "Eco-friendly lodges",
        "Homestay experiences"
      ],
      body: "Experience authentic mountain hospitality in traditional accommodations that blend comfort with local culture. From cozy guesthouses in mountain villages to traditional highland houses, each accommodation offers a unique perspective on local life. Many places provide homestay experiences where you can learn about local traditions and enjoy home-cooked meals prepared with fresh, local ingredients."
    }
  },
  {
    id: '5a4cc817-3800-4347-9c49-1881e094fdae',
    slug: 'transportation',
    content: {
      header: "Plan Your Journey to the Mountains",
      bullets: [
        "Direct flights to Trabzon and Rize",
        "Scenic road routes from major cities",
        "Local bus and minibus services",
        "Private transfer options",
        "Mountain road accessibility"
      ],
      body: "Reaching the Kaçkar Mountains is easier than you might think, with multiple transportation options available. The region is well-connected by air, with direct flights to Trabzon and Rize airports. From there, scenic road routes wind through the mountains, offering breathtaking views along the way. Local transportation services provide convenient access to even the most remote mountain villages."
    }
  }
];

async function updateCategories() {
  for (const category of categories) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: category.content })
      });
      
      if (response.ok) {
        console.log(`✅ Updated ${category.slug}`);
      } else {
        console.error(`❌ Failed to update ${category.slug}:`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error updating ${category.slug}:`, error);
    }
  }
}

updateCategories();

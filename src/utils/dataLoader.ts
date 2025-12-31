import type { MindmapData } from "../types/mindmap";

// Sample data matching the screenshot
const sampleData: MindmapData = {
  id: "vitamins-root",
  title: "Vitamins in Human Body",
  summary: "Essential nutrients required for normal growth and development",
  description:
    "Vitamins are organic compounds that are vital for normal growth and development. They are required in small amounts and must be obtained from the diet as the body cannot produce them in sufficient quantities.",
  category: "vitamins",
  children: [
    {
      id: "dietary-sources",
      title: "Dietary Sources",
      summary: "Natural food sources of vitamins",
      description:
        "Various foods that provide essential vitamins for human health.",
      category: "dietary",
      children: [
        {
          id: "fruits-vegetables",
          title: "Fruits & Vegetables",
          summary: "Rich sources of vitamins A, C, and folate",
          category: "sources",
          metadata: undefined,
        },
        {
          id: "grains-nuts",
          title: "Grains & Nuts",
          summary: "Sources of B vitamins and vitamin E",
          category: "sources",
          metadata: undefined,
        },
        {
          id: "meat-dairy",
          title: "Meat & Dairy",
          summary: "Sources of B12, riboflavin, and vitamin D",
          category: "sources",
          metadata: undefined,
        },
      ],
      metadata: undefined,
    },
    {
      id: "health-impact",
      title: "Health Impact & Balance",
      summary:
        "Maintaining adequate vitamin levels is crucial, as both deficiencies (hypovitaminosis) and excesses (hypervitaminosis) can lead to health problems. These imbalances can manifest in a range of symptoms and conditions, significantly affecting long-term health and quality of life if not addressed.",
      description:
        "The impact of vitamins on human health, including deficiency and excess conditions.",
      category: "health",
      children: [
        {
          id: "deficiency",
          title: "Deficiency",
          summary: "Health problems caused by insufficient vitamin intake",
          category: "deficiency",
          metadata: undefined,
        },
        {
          id: "excess",
          title: "Excess",
          summary: "Health issues from excessive vitamin consumption",
          category: "excess",
          metadata: undefined,
        },
      ],
      metadata: undefined,
    },
    {
      id: "key-bodily-roles",
      title: "Key Bodily Roles",
      summary: "Essential functions vitamins perform in the human body",
      description:
        "Critical roles that vitamins play in maintaining health and supporting bodily functions.",
      category: "health",
      children: [
        {
          id: "immune-support",
          title: "Immune Support",
          summary: "Vitamins C, D, and A support immune system function",
          category: "health",
          metadata: undefined,
        },
        {
          id: "energy-metabolism",
          title: "Energy Metabolism",
          summary: "B vitamins help convert food into energy",
          category: "health",
          metadata: undefined,
        },
        {
          id: "bone-health",
          title: "Bone Health",
          summary: "Vitamins D and K are essential for bone formation",
          category: "health",
          metadata: undefined,
        },
      ],
      metadata: undefined,
    },
    {
      id: "classification",
      title: "Classification",
      summary:
        "Vitamins are classified into fat-soluble and water-soluble categories",
      description:
        "Understanding how vitamins are categorized based on their solubility.",
      category: "classification",
      children: [
        {
          id: "fat-soluble",
          title: "Fat-Soluble (A, D, E, K)",
          summary: "Stored in body fat and liver, can accumulate",
          category: "classification",
          metadata: undefined,
        },
        {
          id: "water-soluble",
          title: "Water-Soluble (B, C)",
          summary: "Not stored in body, need regular replenishment",
          category: "classification",
          metadata: undefined,
        },
      ],
      metadata: undefined,
    },
  ],
  metadata: undefined,
};

export const loadMindmapData = async (): Promise<MindmapData> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedData = localStorage.getItem("mindmap-data");
      if (savedData) {
        try {
          resolve(JSON.parse(savedData));
        } catch {
          resolve(sampleData);
        }
      } else {
        resolve(sampleData);
      }
    }, 500);
  });
};

export const saveMindmapData = async (data: MindmapData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("mindmap-data", JSON.stringify(data));
      resolve();
    }, 100);
  });
};

export const exportMindmapData = (
  data: MindmapData,
  filename: string
): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = filename;
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

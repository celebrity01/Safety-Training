import React from "react";
import type { Category, Achievement } from "./types";

// --- SVG ICONS ---
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S15.885 2.25 10.5 2.25a.75.75 0 00-1.071-.038A9.75 9.75 0 0112.963 2.286z",
      clipRule: "evenodd",
    }),
    React.createElement("path", {
      d: "M10.719 1.234a.75.75 0 00-1.113.864 9.78 9.78 0 00-.57 2.379 7.493 7.493 0 01-4.032 4.032A9.78 9.78 0 004.234 9.08a.75.75 0 00-.864 1.113 9.75 9.75 0 0012.87 12.87.75.75 0 001.113-.864 9.78 9.78 0 00.57-2.379 7.493 7.493 0 014.032-4.032A9.78 9.78 0 0019.766 9.08a.75.75 0 00.864-1.113A9.75 9.75 0 0010.719 1.234z",
    }),
  );

const FloodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M12.378 1.602a.75.75 0 00-.756 0L3 7.252v1.037a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V7.252L12.378 1.602zM21 10.5H3v8.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V10.5z",
    }),
    React.createElement("path", {
      d: "M15.47 13.91a.75.75 0 01.998.118 10.59 10.59 0 011.696 3.016.75.75 0 11-1.41.527 9.09 9.09 0 00-1.45-2.586.75.75 0 01.166-1.075zM10.63 13.91a.75.75 0 00-.166 1.075 9.09 9.09 0 001.45 2.586.75.75 0 101.41-.527 10.59 10.59 0 00-1.696-3.016.75.75 0 00-.998-.118zM5.834 13.75a.75.75 0 01.834.666 9.09 9.09 0 01.27 3.834.75.75 0 11-1.498.07 10.59 10.59 0 00-.316-4.433.75.75 0 01.71-.837z",
    }),
  );

const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M3.75 12a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75c0 .414.336.75.75.75h7.5a.75.75 0 01.75-.75v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v5.25a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V12zm11.25-5.25a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h7.5c.414 0 .75-.336.75-.75v-.75z",
      clipRule: "evenodd",
    }),
    React.createElement("path", {
      d: "M2.25 12c0-3.313 2.686-6 6-6h7.5c3.313 0 6 2.687 6 6v5.25c0 3.313-2.687 6-6 6H8.25c-3.314 0-6-2.687-6-6V12zM8.25 4.5a.75.75 0 01.75.75v.75a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-.75a.75.75 0 011.5 0v.75a3.75 3.75 0 01-3.75 3.75h-1.5A3.75 3.75 0 016.75 6v-.75a.75.75 0 01.75-.75H8.25z",
    }),
  );

const PeopleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M12 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM10.5 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5z",
    }),
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M4.5 9.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM5.25 15a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5H5.25z",
      clipRule: "evenodd",
    }),
    React.createElement("path", {
      d: "M8.25 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM6.75 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5zM15.75 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM14.25 16.5a1.5 1.5 0 00-1.5 1.5v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75a1.5 1.5 0 00-1.5-1.5h-1.5z",
    }),
  );

export const SatelliteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M10.501 3.5a7.5 7.5 0 00-6.195 3.438L1.67 5.108a.75.75 0 00-1.29.908l4.02 6.963a.75.75 0 00.99.33l6.963-4.02a.75.75 0 00.33-.99L10.84 1.328a.75.75 0 00-.909-1.291l-1.83 1.057A7.48 7.48 0 0010.501 3.5zm3.84 1.157l-1.83 1.057a7.5 7.5 0 00-2.012 11.838l-1.057 1.83a.75.75 0 101.29.909l1.83-1.057a7.5 7.5 0 0011.838-2.012l1.057-1.83a.75.75 0 10-.909-1.29l-1.057 1.83a5.999 5.999 0 01-9.457-1.616l2.35-4.072a.75.75 0 00-.33-.99l-4.072-2.35a5.992 5.992 0 01-1.616-9.457l1.83 1.057a.75.75 0 10.908-1.29zM15.001 15a3.75 3.75 0 10-5.304-5.303 3.75 3.75 0 005.304 5.303z",
    }),
  );

export const MegaphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z",
    }),
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75c-.621 0-1.125-.504-1.125-1.125V4.125z",
      clipRule: "evenodd",
    }),
  );

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z",
      clipRule: "evenodd",
    }),
  );

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M16.5 3.75a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z",
      clipRule: "evenodd",
    }),
    React.createElement("path", {
      d: "M8.25 3.75H6a.75.75 0 000 1.5h2.25V19.5a.75.75 0 001.5 0V5.25A1.5 1.5 0 008.25 3.75zM12 3.75a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75zM15.75 3.75a1.5 1.5 0 011.5 1.5V19.5a.75.75 0 001.5 0V5.25a3 3 0 00-3-3H4.5a3 3 0 00-3 3V19.5a.75.75 0 001.5 0V5.25a1.5 1.5 0 011.5-1.5h2.25a.75.75 0 000-1.5H4.5a3 3 0 00-3 3v14.25a.75.75 0 00.75.75h17.5a.75.75 0 00.75-.75V5.25a3 3 0 00-3-3h-2.25z",
    }),
  );

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.596 2.88c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z",
      clipRule: "evenodd",
    }),
  );

const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.301H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z",
      clipRule: "evenodd",
    }),
  );

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z",
    }),
    React.createElement("path", {
      d: "M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V18a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z",
    }),
  );

export const AlertBellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.253a.75.75 0 01-.527-.265 15.63 15.63 0 01-3.423-.372 15.63 15.63 0 01-3.423.372.75.75 0 01-.527.265c-1.67-.263-3.287-.683-4.831-1.253a.75.75 0 01-.297-1.206C4.45 13.807 5.25 11.873 5.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z",
      clipRule: "evenodd",
    }),
  );

export const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M14.25 2.25a.75.75 0 00-1.5 0V3h-1.5V2.25a.75.75 0 00-1.5 0V3h-1.5V2.25a.75.75 0 00-1.5 0V3h-1.5a.75.75 0 000 1.5h1.5v1.5H6.75a.75.75 0 000 1.5h1.5v1.5H6.75a.75.75 0 000 1.5h1.5v1.5H6.75a.75.75 0 000 1.5h1.5v1.5H6.75a.75.75 0 000 1.5h1.5v1.5H9a.75.75 0 000 1.5h1.5v.75a.75.75 0 001.5 0v-.75h1.5v.75a.75.75 0 001.5 0v-.75h1.5a.75.75 0 000-1.5h-1.5v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5h1.5a.75.75 0 000-1.5H14.25V2.25z",
    }),
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-7.5zM4.5 9v6h15V9h-15z",
      clipRule: "evenodd",
    }),
  );

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 11-1.06-1.06l1.591-1.591a.75.75 0 111.06 1.06l-1.591 1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 17.834a.75.75 0 111.06-1.06l1.59-1.591a.75.75 0 111.06 1.06l-1.59 1.591a.75.75 0 01-1.06 0zM12 21.75a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0V21a.75.75 0 01-.75.75zM5.106 17.894a.75.75 0 111.06-1.06l1.591 1.591a.75.75 0 11-1.06 1.06l-1.591-1.59zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.166 6.166a.75.75 0 11-1.06 1.06l-1.59-1.591a.75.75 0 111.06-1.06l1.59 1.591z",
    }),
  );

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.79-.263 1.123l-2.25 3.375c-.23.333-.42.704-.559 1.096l-1.442 3.844a.75.75 0 00.93 1.002l3.843-1.442c.393-.139.764-.33 1.097-.56l3.375-2.25a.75.75 0 00.26-1.122c.334-.23.72-.422 1.123-.264A6.75 6.75 0 0022.5 8.25a6.75 6.75 0 00-6.75-6.75zm.75 3a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z",
      clipRule: "evenodd",
    }),
    React.createElement("path", {
      d: "M3.75 8.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z",
    }),
  );

export const SCENARIO_CATEGORIES: Category[] = [
  { key: "urbanFire", icon: FireIcon },
  { key: "floodResponse", icon: FloodIcon },
  { key: "roadAccident", icon: CarIcon },
  { key: "marketplaceStampede", icon: PeopleIcon },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_game",
    nameKey: "ach_first_game_name",
    descriptionKey: "ach_first_game_desc",
    icon: StarIcon,
    rarity: "common",
  },
  {
    id: "perfect_score",
    nameKey: "ach_perfect_score_name",
    descriptionKey: "ach_perfect_score_desc",
    icon: TrophyIcon,
    rarity: "rare",
  },
  {
    id: "quick_thinker",
    nameKey: "ach_quick_thinker_name",
    descriptionKey: "ach_quick_thinker_desc",
    icon: BoltIcon,
    rarity: "rare",
  },
  {
    id: "level_5",
    nameKey: "ach_level_5_name",
    descriptionKey: "ach_level_5_desc",
    icon: StarIcon,
    rarity: "legendary",
  },
  {
    id: "fire_fighter",
    nameKey: "ach_fire_fighter_name",
    descriptionKey: "ach_fire_fighter_desc",
    icon: FireIcon,
    rarity: "common",
  },
  {
    id: "flood_expert",
    nameKey: "ach_flood_expert_name",
    descriptionKey: "ach_flood_expert_desc",
    icon: FloodIcon,
    rarity: "common",
  },
  {
    id: "comms_check",
    nameKey: "ach_comms_check_name",
    descriptionKey: "ach_comms_check_desc",
    icon: SatelliteIcon,
    rarity: "common",
  },
  {
    id: "chat_starter",
    nameKey: "ach_chat_starter_name",
    descriptionKey: "ach_chat_starter_desc",
    icon: ChatBubbleIcon,
    rarity: "common",
  },
];

export const NIGERIAN_STATES: string[] = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

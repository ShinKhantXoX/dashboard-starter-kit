import { 
  IconCircle, 
  IconFlag3,
  IconPolaroid,
  IconBuildingSkyscraper,
  IconTag,
  IconBalloon,
  IconArticle,
  IconFileText,
  IconList,
  IconMist,
  IconNews,
  IconBlockquote,
  IconRecycle
 } from "@tabler/icons-react";

export const navList = [
    { icon: <IconFlag3 />, label: "Country", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/country' },
    ] },
    { icon: <IconBuildingSkyscraper />, label: "City", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/city' },
    ] },
    { icon: <IconBalloon />, label: "Tour", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/tour' },
    ] },
    { icon: <IconTag />, label: "Package", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/package' },
    ] },
    { icon: <IconArticle />, label: "Package Tour", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/package-tour' },
    ] },
    { icon: <IconMist />, label: "Package Itinerary", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/package-itinerary' },
    ] },
    { icon: <IconList />, label: "Itinerary", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/itinerary' },
    ] },
    { icon: <IconFileText />, label: "Inclusion", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/inclusion' },
    ] },
    { icon: <IconFileText />, label: "Package Inclusion", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/package-inclusion' },
    ] },
    { icon: <IconNews />, label: "News", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/news' },
    ] },
    { icon: <IconBlockquote />, label: "News Content", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/news-content' },
    ] },
    { icon: <IconBlockquote />, label: "Query Form", url: null, children: [
      { icon: <IconCircle />, label: "List", url: '/query-form' },
    ] },
    { icon: <IconPolaroid />, label: "Gallery", url: "/media", children: [] },
    { icon: <IconRecycle color="red"/>, label: <p style={{ color : 'red' }}>Recycle</p>, url: "/bin", children: [] },
]
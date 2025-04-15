import { MenuPage } from "@/src/shared/sidebar/nav-main/components/menu-page";
import { notFound } from 'next/navigation';

interface Props {
  params: {
    dashboard: string;
    menu_item?: string[];
  };
}

export default function DashboardMenuItemPage({ params }: Props) {
  const { dashboard, menu_item } = params;

  if (!menu_item || menu_item.length === 0) {
    return notFound();
  }

  const menuItemPath = menu_item.join('/');

  return <MenuPage menuItemPath={menuItemPath} />;
}
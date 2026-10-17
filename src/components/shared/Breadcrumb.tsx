import React from 'react'
import { Link, useMatches } from 'react-router-dom'
import { Breadcrumb as BreadcrumbUI, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


const Breadcrumb = () => {

        const matches = useMatches()
    const crumbs = matches
      .filter((m) => (m.handle as { breadcrumb?: string } | undefined)?.breadcrumb)
      .map((m) => ({ label: (m.handle as { breadcrumb: string }).breadcrumb, to: m.pathname }))
    return (
        <BreadcrumbUI className="text-sm">
                    <BreadcrumbList>
                      {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1
                        return (
                          <React.Fragment key={crumb.to}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink asChild>
                                  <Link to={crumb.to}>{crumb.label}</Link>
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        )
                      })}
                    </BreadcrumbList>
        </BreadcrumbUI>
    )

}

export default Breadcrumb;
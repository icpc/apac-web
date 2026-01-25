import Link from 'next/link';
import Container from "@/components/common/container";

export function PageNotFound() {
    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-text-header-secondary mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Link 
                        href="/championship/latest/information"
                        className="px-6 py-3 text-lg font-medium rounded-lg transition-colors dark:text-white border border-text-header-secondary dark:border-primaryAccent-dark bg-primaryAccent/10 dark:bg-primaryAccent-dark/10 text-text-header-secondary hover:bg-primaryAccent/20 dark:hover:bg-primaryAccent-dark/20"
                    >
                        See the current championship
                    </Link>
                </div>

            </div>
        </Container>
    );
}


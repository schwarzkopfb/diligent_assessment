-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL,
    "original_language" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "poster_path" TEXT,
    "release_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "vote_count" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieSearch" (
    "term" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "cache_hit_count" INTEGER NOT NULL DEFAULT 0,
    "total_results" INTEGER NOT NULL,
    "total_pages" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieSearch_pkey" PRIMARY KEY ("term","page")
);

-- CreateTable
CREATE TABLE "MovieSearchToMovie" (
    "id" SERIAL NOT NULL,
    "page" INTEGER NOT NULL,
    "search_term" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieSearchToMovie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieSearchToMovie" ADD CONSTRAINT "MovieSearchToMovie_search_term_page_fkey" FOREIGN KEY ("search_term", "page") REFERENCES "MovieSearch"("term", "page") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieSearchToMovie" ADD CONSTRAINT "MovieSearchToMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

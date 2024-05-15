<?php

declare(strict_types=1);

namespace DoctrineMigrations\Tenant;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240430213303 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE Achievable (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, createdAt DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', startedAt DATETIME DEFAULT NULL, finishedAt DATETIME DEFAULT NULL, status INT NOT NULL, duration INT DEFAULT NULL, weight INT DEFAULT NULL, type VARCHAR(255) NOT NULL, title VARCHAR(255) DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, INDEX IDX_F8CEBE63727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task_tag (task_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_6C0B4F048DB60186 (task_id), INDEX IDX_6C0B4F04BAD26311 (tag_id), PRIMARY KEY(task_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_tag (project_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_91F26D60166D1F9C (project_id), INDEX IDX_91F26D60BAD26311 (tag_id), PRIMARY KEY(project_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE AchievementProgress (id INT AUTO_INCREMENT NOT NULL, flatcount INT DEFAULT NULL, percentcount INT DEFAULT NULL, flatweight INT DEFAULT NULL, percentweight INT DEFAULT NULL, flatduration INT DEFAULT NULL, percentduration INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE Tag (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, color VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE Achievable ADD CONSTRAINT FK_F8CEBE63727ACA70 FOREIGN KEY (parent_id) REFERENCES Achievable (id)');
        $this->addSql('ALTER TABLE task_tag ADD CONSTRAINT FK_6C0B4F048DB60186 FOREIGN KEY (task_id) REFERENCES Achievable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task_tag ADD CONSTRAINT FK_6C0B4F04BAD26311 FOREIGN KEY (tag_id) REFERENCES Tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_tag ADD CONSTRAINT FK_91F26D60166D1F9C FOREIGN KEY (project_id) REFERENCES Achievable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_tag ADD CONSTRAINT FK_91F26D60BAD26311 FOREIGN KEY (tag_id) REFERENCES Tag (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Achievable DROP FOREIGN KEY FK_F8CEBE63727ACA70');
        $this->addSql('ALTER TABLE task_tag DROP FOREIGN KEY FK_6C0B4F048DB60186');
        $this->addSql('ALTER TABLE task_tag DROP FOREIGN KEY FK_6C0B4F04BAD26311');
        $this->addSql('ALTER TABLE project_tag DROP FOREIGN KEY FK_91F26D60166D1F9C');
        $this->addSql('ALTER TABLE project_tag DROP FOREIGN KEY FK_91F26D60BAD26311');
        $this->addSql('DROP TABLE Achievable');
        $this->addSql('DROP TABLE task_tag');
        $this->addSql('DROP TABLE project_tag');
        $this->addSql('DROP TABLE AchievementProgress');
        $this->addSql('DROP TABLE Tag');
    }
}

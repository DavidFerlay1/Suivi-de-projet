<?php

declare(strict_types=1);

namespace DoctrineMigrations\Tenant;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240614065653 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE achievable_team (achievable_id INT NOT NULL, team_id INT NOT NULL, INDEX IDX_756B0C51993497C5 (achievable_id), INDEX IDX_756B0C51296CD8AE (team_id), PRIMARY KEY(achievable_id, team_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE achievable_team ADD CONSTRAINT FK_756B0C51993497C5 FOREIGN KEY (achievable_id) REFERENCES Achievable (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE achievable_team ADD CONSTRAINT FK_756B0C51296CD8AE FOREIGN KEY (team_id) REFERENCES Team (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE Achievable ADD affectedIndividualProfileIds LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', ADD rootParent_id INT NOT NULL');
        $this->addSql('ALTER TABLE Achievable ADD CONSTRAINT FK_F8CEBE63A5166755 FOREIGN KEY (rootParent_id) REFERENCES Achievable (id)');
        $this->addSql('CREATE INDEX IDX_F8CEBE63A5166755 ON Achievable (rootParent_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE achievable_team DROP FOREIGN KEY FK_756B0C51993497C5');
        $this->addSql('ALTER TABLE achievable_team DROP FOREIGN KEY FK_756B0C51296CD8AE');
        $this->addSql('DROP TABLE achievable_team');
        $this->addSql('ALTER TABLE Achievable DROP FOREIGN KEY FK_F8CEBE63A5166755');
        $this->addSql('DROP INDEX IDX_F8CEBE63A5166755 ON Achievable');
        $this->addSql('ALTER TABLE Achievable DROP affectedIndividualProfileIds, DROP rootParent_id');
    }
}
